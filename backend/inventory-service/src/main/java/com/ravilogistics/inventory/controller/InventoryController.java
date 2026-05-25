package com.ravilogistics.inventory.controller;

import com.ravilogistics.inventory.dto.*;
import com.ravilogistics.inventory.entity.Inventory;
import com.ravilogistics.inventory.entity.InventoryTransaction;
import com.ravilogistics.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor

public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<Inventory>> getInventory(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long itemId) {
        if (customerId != null) return ResponseEntity.ok(inventoryService.getInventoryByCustomer(customerId));
        if (itemId != null) return ResponseEntity.ok(inventoryService.getInventoryByItem(itemId));
        return ResponseEntity.ok(inventoryService.getInventoryByCustomer(null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    @GetMapping("/available")
    public ResponseEntity<Map<String, Object>> checkAvailable(
            @RequestParam Long itemId,
            @RequestParam Long customerId) {
        BigDecimal qty = inventoryService.getAvailableQty(itemId, customerId);
        return ResponseEntity.ok(Map.of("itemId", itemId, "customerId", customerId, "availableQty", qty));
    }

    @PostMapping("/receive")
    public ResponseEntity<Inventory> receiveInventory(@Valid @RequestBody InventoryReceiptDTO dto) {
        return ResponseEntity.ok(inventoryService.receiveInventory(dto));
    }

    @PostMapping("/adjust")
    public ResponseEntity<Inventory> adjustInventory(@Valid @RequestBody InventoryAdjustmentDTO dto) {
        return ResponseEntity.ok(inventoryService.adjustInventory(dto));
    }

    @PostMapping("/reserve")
    public ResponseEntity<Map<String, String>> reserveInventory(@Valid @RequestBody ReserveInventoryDTO dto) {
        inventoryService.reserveInventory(dto);
        return ResponseEntity.ok(Map.of("message", "Inventory reserved successfully"));
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<InventoryTransaction>> getTransactions(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getTransactions(id));
    }
}
