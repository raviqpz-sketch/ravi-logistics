package com.ravilogistics.item.controller;

import com.ravilogistics.item.dto.ItemDTO;
import com.ravilogistics.item.entity.Customer;
import com.ravilogistics.item.entity.Item;
import com.ravilogistics.item.entity.Warehouse;
import com.ravilogistics.item.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    // --- Item endpoints ---
    @GetMapping("/items")
    public ResponseEntity<List<Item>> getItems(@RequestParam(required = false) Long customerId,
                                               @RequestParam(required = false) String search) {
        if (search != null && customerId != null) {
            return ResponseEntity.ok(itemService.searchItems(customerId, search));
        }
        return ResponseEntity.ok(itemService.getAllItems(customerId));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<Item> getItem(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @PostMapping("/items")
    public ResponseEntity<Item> createItem(@Valid @RequestBody ItemDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.createItem(dto));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @Valid @RequestBody ItemDTO dto) {
        return ResponseEntity.ok(itemService.updateItem(id, dto));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Map<String, String>> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok(Map.of("message", "Item deactivated successfully"));
    }

    // --- Customer endpoints ---
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getCustomers() {
        return ResponseEntity.ok(itemService.getAllCustomers());
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getCustomerById(id));
    }

    @PostMapping("/customers")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.createCustomer(customer));
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        return ResponseEntity.ok(itemService.updateCustomer(id, customer));
    }

    // --- Warehouse endpoints ---
    @GetMapping("/warehouses")
    public ResponseEntity<List<Warehouse>> getWarehouses() {
        return ResponseEntity.ok(itemService.getAllWarehouses());
    }

    @PostMapping("/warehouses")
    public ResponseEntity<Warehouse> createWarehouse(@RequestBody Warehouse warehouse) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.createWarehouse(warehouse));
    }
}
