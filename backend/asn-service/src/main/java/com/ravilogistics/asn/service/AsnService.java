package com.ravilogistics.asn.service;

import com.ravilogistics.asn.dto.AsnDTO;
import com.ravilogistics.asn.dto.AsnLineDTO;
import com.ravilogistics.asn.entity.Asn;
import com.ravilogistics.asn.entity.AsnLine;
import com.ravilogistics.asn.entity.Receipt;
import com.ravilogistics.asn.entity.ReceiptLine;
import com.ravilogistics.asn.repository.AsnLineRepository;
import com.ravilogistics.asn.repository.AsnRepository;
import com.ravilogistics.asn.repository.ReceiptLineRepository;
import com.ravilogistics.asn.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AsnService {

    private final AsnRepository asnRepository;
    private final AsnLineRepository asnLineRepository;
    private final ReceiptRepository receiptRepository;
    private final ReceiptLineRepository receiptLineRepository;

    public List<Asn> getAllAsns(Long customerId) {
        if (customerId != null) {
            return asnRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        }
        return asnRepository.findAllByOrderByCreatedAtDesc();
    }

    public Asn getAsnById(Long id) {
        return asnRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ASN not found with id: " + id));
    }

    public List<AsnLine> getAsnLines(Long asnId) {
        return asnLineRepository.findByAsnIdOrderByLineNumber(asnId);
    }

    @Transactional
    public Asn createAsn(AsnDTO dto) {
        if (asnRepository.existsByAsnNumber(dto.getAsnNumber())) {
            throw new RuntimeException("ASN number already exists: " + dto.getAsnNumber());
        }

        Asn asn = new Asn();
        asn.setAsnNumber(dto.getAsnNumber());
        asn.setCustomerId(dto.getCustomerId());
        asn.setWarehouseId(dto.getWarehouseId());
        asn.setSupplierName(dto.getSupplierName());
        asn.setSupplierRef(dto.getSupplierRef());
        asn.setExpectedDate(dto.getExpectedDate());
        asn.setStatus(dto.getStatus() != null ? dto.getStatus() : "DRAFT");
        asn.setNotes(dto.getNotes());
        asn.setCreatedBy(dto.getCreatedBy());

        Asn savedAsn = asnRepository.save(asn);

        if (dto.getLines() != null && !dto.getLines().isEmpty()) {
            int lineNum = 1;
            for (AsnLineDTO lineDto : dto.getLines()) {
                AsnLine line = new AsnLine();
                line.setAsnId(savedAsn.getAsnId());
                line.setLineNumber(lineNum++);
                line.setItemId(lineDto.getItemId());
                line.setExpectedQty(lineDto.getExpectedQty());
                line.setReceivedQty(BigDecimal.ZERO);
                line.setLotNumber(lineDto.getLotNumber());
                line.setExpiryDate(lineDto.getExpiryDate());
                line.setStatus("PENDING");
                asnLineRepository.save(line);
            }
        }

        return savedAsn;
    }

    @Transactional
    public Asn updateAsnStatus(Long id, String status) {
        Asn asn = getAsnById(id);
        validateStatusTransition(asn.getStatus(), status);
        asn.setStatus(status);
        return asnRepository.save(asn);
    }

    private void validateStatusTransition(String currentStatus, String newStatus) {
        // Valid transitions: DRAFT -> CONFIRMED -> IN_RECEIVING -> RECEIVED / CLOSED
        switch (currentStatus) {
            case "DRAFT":
                if (!newStatus.equals("CONFIRMED") && !newStatus.equals("CANCELLED")) {
                    throw new RuntimeException("Cannot transition from DRAFT to " + newStatus);
                }
                break;
            case "CONFIRMED":
                if (!newStatus.equals("IN_RECEIVING") && !newStatus.equals("CANCELLED")) {
                    throw new RuntimeException("Cannot transition from CONFIRMED to " + newStatus);
                }
                break;
            case "IN_RECEIVING":
                if (!newStatus.equals("RECEIVED") && !newStatus.equals("CLOSED")) {
                    throw new RuntimeException("Cannot transition from IN_RECEIVING to " + newStatus);
                }
                break;
            case "RECEIVED":
                if (!newStatus.equals("CLOSED")) {
                    throw new RuntimeException("Cannot transition from RECEIVED to " + newStatus);
                }
                break;
            default:
                throw new RuntimeException("Cannot transition from " + currentStatus + " status");
        }
    }

    @Transactional
    public ReceiptLine receiveAsnLine(Long asnLineId, BigDecimal qty, Long locationId) {
        AsnLine asnLine = asnLineRepository.findById(asnLineId)
            .orElseThrow(() -> new RuntimeException("ASN line not found: " + asnLineId));

        if (qty == null || qty.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Received quantity must be positive");
        }

        BigDecimal newReceivedQty = asnLine.getReceivedQty().add(qty);
        if (newReceivedQty.compareTo(asnLine.getExpectedQty()) > 0) {
            throw new RuntimeException("Received quantity exceeds expected quantity for ASN line: " + asnLineId);
        }

        asnLine.setReceivedQty(newReceivedQty);
        if (newReceivedQty.compareTo(asnLine.getExpectedQty()) >= 0) {
            asnLine.setStatus("RECEIVED");
        } else {
            asnLine.setStatus("PARTIAL");
        }
        asnLineRepository.save(asnLine);

        // Find or create receipt for this ASN
        Asn asn = getAsnById(asnLine.getAsnId());
        Receipt receipt = receiptRepository.findByAsnIdAndStatus(asnLine.getAsnId(), "OPEN")
            .orElseGet(() -> createReceipt(asn));

        // Update ASN status to IN_RECEIVING if not already
        if ("CONFIRMED".equals(asn.getStatus()) || "DRAFT".equals(asn.getStatus())) {
            asn.setStatus("IN_RECEIVING");
            asnRepository.save(asn);
        }

        // Create receipt line
        ReceiptLine receiptLine = new ReceiptLine();
        receiptLine.setReceiptId(receipt.getReceiptId());
        receiptLine.setAsnLineId(asnLineId);
        receiptLine.setItemId(asnLine.getItemId());
        receiptLine.setReceivedQty(qty);
        receiptLine.setPutawayLocationId(locationId);
        receiptLine.setLotNumber(asnLine.getLotNumber());
        receiptLineRepository.save(receiptLine);

        // Check if all lines are received - if so, mark ASN as RECEIVED
        long totalLines = asnLineRepository.countByAsnId(asnLine.getAsnId());
        long receivedLines = asnLineRepository.countByAsnIdAndStatus(asnLine.getAsnId(), "RECEIVED");
        if (totalLines > 0 && totalLines == receivedLines) {
            asn.setStatus("RECEIVED");
            asnRepository.save(asn);
            receipt.setStatus("CLOSED");
            receiptRepository.save(receipt);
        }

        return receiptLine;
    }

    private Receipt createReceipt(Asn asn) {
        String receiptNumber = "RCP-" + asn.getAsnNumber() + "-" +
            LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Receipt receipt = new Receipt();
        receipt.setAsnId(asn.getAsnId());
        receipt.setReceiptNumber(receiptNumber);
        receipt.setWarehouseId(asn.getWarehouseId());
        receipt.setReceivedDate(LocalDateTime.now());
        receipt.setStatus("OPEN");
        return receiptRepository.save(receipt);
    }

    public List<Receipt> getAllReceipts(Long asnId) {
        if (asnId != null) {
            return receiptRepository.findByAsnIdOrderByCreatedAtDesc(asnId);
        }
        return receiptRepository.findAll();
    }
}
