package com.ravilogistics.order.repository;

import com.ravilogistics.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);

    List<Order> findByStatus(String status);

    List<Order> findByCustomerIdAndStatus(Long customerId, String status);

    List<Order> findByRequiredShipDateBefore(LocalDate date);

    boolean existsByOrderNumber(String orderNumber);
}
