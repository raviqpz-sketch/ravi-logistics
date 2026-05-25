package com.ravilogistics.order.service;

import com.ravilogistics.order.dto.CreateOrderDTO;
import com.ravilogistics.order.dto.OrderLineDTO;
import com.ravilogistics.order.entity.Order;
import com.ravilogistics.order.entity.OrderLine;
import com.ravilogistics.order.repository.OrderLineRepository;
import com.ravilogistics.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;

    public List<Order> getAllOrders(Long customerId, String status) {
        if (customerId != null && status != null) {
            return orderRepository.findByCustomerIdAndStatus(customerId, status);
        }
        if (customerId != null) {
            return orderRepository.findByCustomerId(customerId);
        }
        if (status != null) {
            return orderRepository.findByStatus(status);
        }
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    @Transactional
    public Order createOrder(CreateOrderDTO dto) {
        if (orderRepository.existsByOrderNumber(dto.getOrderNumber())) {
            throw new RuntimeException("Order number already exists: " + dto.getOrderNumber());
        }

        Order order = new Order();
        order.setOrderNumber(dto.getOrderNumber());
        order.setCustomerId(dto.getCustomerId());
        order.setWarehouseId(dto.getWarehouseId());
        order.setRequiredShipDate(dto.getRequiredShipDate());
        order.setShipToName(dto.getShipToName());
        order.setShipToAddress1(dto.getShipToAddress1());
        order.setShipToCity(dto.getShipToCity());
        order.setShipToState(dto.getShipToState());
        order.setShipToZip(dto.getShipToZip());
        order.setCarrierId(dto.getCarrierId());
        order.setServiceLevel(dto.getServiceLevel());
        order.setPriority(dto.getPriority() != null ? dto.getPriority() : 5);
        order.setNotes(dto.getNotes());
        order.setStatus("CREATED");

        Order savedOrder = orderRepository.save(order);

        List<OrderLine> lines = new ArrayList<>();
        int lineNum = 1;
        for (OrderLineDTO lineDTO : dto.getLines()) {
            OrderLine line = new OrderLine();
            line.setOrderId(savedOrder.getOrderId());
            line.setLineNumber(lineNum++);
            line.setItemId(lineDTO.getItemId());
            line.setOrderedQty(lineDTO.getOrderedQty());
            line.setStatus("CREATED");
            lines.add(line);
        }
        orderLineRepository.saveAll(lines);

        return savedOrder;
    }

    @Transactional
    public Order allocateOrder(Long orderId) {
        Order order = getOrderById(orderId);
        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot allocate a cancelled order: " + orderId);
        }
        if ("SHIPPED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot allocate a shipped order: " + orderId);
        }

        // In a real system, this would call Inventory Service to reserve stock.
        // For this implementation, we assume inventory is available and directly allocate.
        List<OrderLine> lines = orderLineRepository.findByOrderId(orderId);
        for (OrderLine line : lines) {
            line.setAllocatedQty(line.getOrderedQty());
            line.setStatus("ALLOCATED");
        }
        orderLineRepository.saveAll(lines);

        order.setStatus("ALLOCATED");
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        if ("SHIPPED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel a shipped order: " + orderId);
        }

        List<OrderLine> lines = orderLineRepository.findByOrderId(orderId);
        for (OrderLine line : lines) {
            line.setStatus("CANCELLED");
        }
        orderLineRepository.saveAll(lines);

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public List<OrderLine> getOrderLines(Long orderId) {
        // Verify order exists first
        getOrderById(orderId);
        return orderLineRepository.findByOrderId(orderId);
    }
}
