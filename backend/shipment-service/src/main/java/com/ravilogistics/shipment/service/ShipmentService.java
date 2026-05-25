package com.ravilogistics.shipment.service;

import com.ravilogistics.shipment.dto.AddShipmentBoxDTO;
import com.ravilogistics.shipment.dto.CreateShipmentDTO;
import com.ravilogistics.shipment.dto.DispatchShipmentDTO;
import com.ravilogistics.shipment.entity.Carrier;
import com.ravilogistics.shipment.entity.Shipment;
import com.ravilogistics.shipment.entity.ShipmentBox;
import com.ravilogistics.shipment.repository.CarrierRepository;
import com.ravilogistics.shipment.repository.ShipmentBoxRepository;
import com.ravilogistics.shipment.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentBoxRepository shipmentBoxRepository;
    private final CarrierRepository carrierRepository;

    public List<Shipment> getAllShipments(String status) {
        if (status != null && !status.isBlank()) {
            return shipmentRepository.findByStatus(status);
        }
        return shipmentRepository.findAll();
    }

    public Shipment getShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found with id: " + id));
    }

    public List<Shipment> getShipmentByOrder(Long orderId) {
        return shipmentRepository.findByOrderId(orderId);
    }

    @Transactional
    public Shipment createShipment(CreateShipmentDTO dto) {
        Shipment shipment = new Shipment();
        shipment.setOrderId(dto.getOrderId());
        shipment.setPackTaskId(dto.getPackTaskId());
        shipment.setCarrierId(dto.getCarrierId());
        shipment.setCarrierName(dto.getCarrierName());
        shipment.setServiceLevel(dto.getServiceLevel());
        shipment.setTrackingNumber(dto.getTrackingNumber());
        shipment.setEstimatedDelivery(dto.getEstimatedDelivery());
        shipment.setStatus("CREATED");
        shipment.setTotalBoxes(0);

        // Save first to get generated ID
        Shipment savedShipment = shipmentRepository.save(shipment);

        // Generate shipment number
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String shipmentNumber = String.format("SHIP-%s-%04d", dateStr, savedShipment.getShipmentId());
        savedShipment.setShipmentNumber(shipmentNumber);

        return shipmentRepository.save(savedShipment);
    }

    @Transactional
    public ShipmentBox addBoxToShipment(AddShipmentBoxDTO dto) {
        Shipment shipment = getShipmentById(dto.getShipmentId());

        ShipmentBox box = new ShipmentBox();
        box.setShipmentId(dto.getShipmentId());
        box.setBoxId(dto.getBoxId());
        box.setBoxLabel(dto.getBoxLabel());
        box.setWeight(dto.getWeight());
        ShipmentBox savedBox = shipmentBoxRepository.save(box);

        // Update total boxes count
        shipment.setTotalBoxes(shipment.getTotalBoxes() + 1);
        shipmentRepository.save(shipment);

        return savedBox;
    }

    @Transactional
    public Shipment dispatchShipment(Long shipmentId, DispatchShipmentDTO dto) {
        Shipment shipment = getShipmentById(shipmentId);
        shipment.setStatus("DISPATCHED");
        shipment.setDispatchedAt(LocalDateTime.now());
        if (dto.getShipDate() != null) {
            shipment.setShipDate(dto.getShipDate());
        } else {
            shipment.setShipDate(LocalDate.now());
        }
        shipment.setShippedBy(dto.getShippedBy());
        shipment.setFreightCost(dto.getFreightCost());
        return shipmentRepository.save(shipment);
    }

    @Transactional
    public Shipment updateStatus(Long shipmentId, String status) {
        Shipment shipment = getShipmentById(shipmentId);
        shipment.setStatus(status);
        return shipmentRepository.save(shipment);
    }

    public List<Carrier> getAllCarriers() {
        return carrierRepository.findByIsActiveTrue();
    }

    public List<ShipmentBox> getShipmentBoxes(Long shipmentId) {
        // Verify shipment exists
        getShipmentById(shipmentId);
        return shipmentBoxRepository.findByShipmentId(shipmentId);
    }
}
