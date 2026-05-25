package com.ravilogistics.shipment.controller;

import com.ravilogistics.shipment.dto.AddShipmentBoxDTO;
import com.ravilogistics.shipment.dto.CreateShipmentDTO;
import com.ravilogistics.shipment.dto.DispatchShipmentDTO;
import com.ravilogistics.shipment.entity.Carrier;
import com.ravilogistics.shipment.entity.Shipment;
import com.ravilogistics.shipment.entity.ShipmentBox;
import com.ravilogistics.shipment.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(shipmentService.getAllShipments(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Shipment>> getShipmentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(shipmentService.getShipmentByOrder(orderId));
    }

    @PostMapping
    public ResponseEntity<Shipment> createShipment(@Valid @RequestBody CreateShipmentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shipmentService.createShipment(dto));
    }

    @PostMapping("/{id}/boxes")
    public ResponseEntity<ShipmentBox> addBoxToShipment(
            @PathVariable Long id,
            @Valid @RequestBody AddShipmentBoxDTO dto) {
        dto.setShipmentId(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(shipmentService.addBoxToShipment(dto));
    }

    @PostMapping("/{id}/dispatch")
    public ResponseEntity<Shipment> dispatchShipment(
            @PathVariable Long id,
            @RequestBody DispatchShipmentDTO dto) {
        return ResponseEntity.ok(shipmentService.dispatchShipment(id, dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Shipment> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(shipmentService.updateStatus(id, status));
    }

    @GetMapping("/{id}/boxes")
    public ResponseEntity<List<ShipmentBox>> getShipmentBoxes(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipmentBoxes(id));
    }

    @GetMapping("/carriers")
    public ResponseEntity<List<Carrier>> getAllCarriers() {
        return ResponseEntity.ok(shipmentService.getAllCarriers());
    }
}
