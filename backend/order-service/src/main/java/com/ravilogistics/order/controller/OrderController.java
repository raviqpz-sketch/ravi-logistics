package com.ravilogistics.order.controller;

import com.ravilogistics.order.dto.CreateOrderDTO;
import com.ravilogistics.order.entity.Order;
import com.ravilogistics.order.entity.OrderLine;
import com.ravilogistics.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor

public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.getAllOrders(customerId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderDTO dto) {
        return ResponseEntity.ok(orderService.createOrder(dto));
    }

    @PostMapping("/{id}/allocate")
    public ResponseEntity<Order> allocateOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.allocateOrder(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @GetMapping("/{id}/lines")
    public ResponseEntity<List<OrderLine>> getOrderLines(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderLines(id));
    }
}
