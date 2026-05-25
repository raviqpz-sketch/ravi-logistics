package com.ravilogistics.inventory.service;

import com.ravilogistics.inventory.dto.*;
import com.ravilogistics.inventory.entity.Inventory;
import com.ravilogistics.inventory.entity.InventoryTransaction;
import com.ravilogistics.inventory.repository.InventoryRepository;
import com.ravilogistics.inventory.repository.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;

    public List<Inventory> getInventoryByCustomer(Long customerId) {
        return inventoryRepository.findByCustomerId(customerId);
    }

    public List<Inventory> getInventoryByItem(Long itemId) {
        return inventoryRepository.findByItemId(itemId);
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Inventory record not found: " + id));
    }

    public BigDecimal getAvailableQty(Long itemId, Long customerId) {
        BigDecimal total = inventoryRepository.getTotalAvailableByItemAndCustomer(itemId, customerId);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional
    public Inventory receiveInventory(InventoryReceiptDTO dto) {
        String lot = dto.getLotNumber() != null ? dto.getLotNumber() : "DEFAULT";
        Inventory inv = inventoryRepository
            .findByItemIdAndLocationIdAndLotNumber(dto.getItemId(), dto.getLocationId(), lot)
            .orElseGet(() -> {
                Inventory newInv = new Inventory();
                newInv.setCustomerId(dto.getCustomerId());
                newInv.setWarehouseId(dto.getWarehouseId());
                newInv.setItemId(dto.getItemId());
                newInv.setLocationId(dto.getLocationId());
                newInv.setLotNumber(lot);
                newInv.setOnHandQty(BigDecimal.ZERO);
                newInv.setReservedQty(BigDecimal.ZERO);
                newInv.setUom(dto.getUom() != null ? dto.getUom() : "EA");
                return newInv;
            });

        BigDecimal before = inv.getOnHandQty();
        inv.setOnHandQty(before.add(dto.getQuantity()));
        Inventory saved = inventoryRepository.save(inv);

        createTransaction(saved.getInventoryId(), dto.getCustomerId(), dto.getItemId(),
            dto.getLocationId(), "RECEIPT", dto.getQuantity(), before,
            saved.getOnHandQty(), dto.getReferenceType(), dto.getReferenceId(),
            lot, dto.getCreatedBy());

        return saved;
    }

    @Transactional
    public Inventory adjustInventory(InventoryAdjustmentDTO dto) {
        Inventory inv = getInventoryById(dto.getInventoryId());
        BigDecimal before = inv.getOnHandQty();
        BigDecimal after = before.add(dto.getAdjustmentQty());
        if (after.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Adjustment would result in negative inventory");
        }
        inv.setOnHandQty(after);
        Inventory saved = inventoryRepository.save(inv);

        createTransaction(saved.getInventoryId(), saved.getCustomerId(), saved.getItemId(),
            saved.getLocationId(), "ADJUSTMENT", dto.getAdjustmentQty(), before, after,
            "MANUAL", null, saved.getLotNumber(), dto.getAdjustedBy());

        return saved;
    }

    @Transactional
    public void reserveInventory(ReserveInventoryDTO dto) {
        List<Inventory> invList = inventoryRepository.findAvailableInventoryByCustomer(dto.getCustomerId())
            .stream()
            .filter(i -> i.getItemId().equals(dto.getItemId()))
            .toList();

        BigDecimal remaining = dto.getQuantity();
        for (Inventory inv : invList) {
            if (remaining.compareTo(BigDecimal.ZERO) <= 0) break;
            BigDecimal canReserve = inv.getAvailableQty().min(remaining);
            inv.setReservedQty(inv.getReservedQty().add(canReserve));
            inventoryRepository.save(inv);
            remaining = remaining.subtract(canReserve);
        }

        if (remaining.compareTo(BigDecimal.ZERO) > 0) {
            throw new RuntimeException("Insufficient inventory. Short by: " + remaining);
        }
    }

    @Transactional
    public void deductInventory(Long itemId, Long customerId, BigDecimal qty,
                                 String referenceType, Long referenceId) {
        List<Inventory> invList = inventoryRepository.findByCustomerIdAndItemId(customerId, itemId);
        BigDecimal remaining = qty;
        for (Inventory inv : invList) {
            if (remaining.compareTo(BigDecimal.ZERO) <= 0) break;
            BigDecimal canDeduct = inv.getReservedQty().min(remaining);
            BigDecimal before = inv.getOnHandQty();
            inv.setOnHandQty(inv.getOnHandQty().subtract(canDeduct));
            inv.setReservedQty(inv.getReservedQty().subtract(canDeduct));
            inventoryRepository.save(inv);
            createTransaction(inv.getInventoryId(), customerId, itemId, inv.getLocationId(),
                "SHIPMENT", canDeduct.negate(), before, inv.getOnHandQty(),
                referenceType, referenceId, inv.getLotNumber(), "SYSTEM");
            remaining = remaining.subtract(canDeduct);
        }
    }

    public List<InventoryTransaction> getTransactions(Long inventoryId) {
        return transactionRepository.findByInventoryId(inventoryId);
    }

    private void createTransaction(Long inventoryId, Long customerId, Long itemId, Long locationId,
                                    String type, BigDecimal qty, BigDecimal before, BigDecimal after,
                                    String refType, Long refId, String lot, String by) {
        InventoryTransaction txn = new InventoryTransaction();
        txn.setInventoryId(inventoryId);
        txn.setCustomerId(customerId);
        txn.setItemId(itemId);
        txn.setLocationId(locationId);
        txn.setTxnType(type);
        txn.setTxnQty(qty);
        txn.setBeforeQty(before);
        txn.setAfterQty(after);
        txn.setReferenceType(refType);
        txn.setReferenceId(refId);
        txn.setLotNumber(lot);
        txn.setCreatedBy(by);
        txn.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(txn);
    }
}
