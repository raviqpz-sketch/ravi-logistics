package com.ravilogistics.order.repository;

import com.ravilogistics.order.entity.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {

    List<OrderLine> findByOrderId(Long orderId);

    List<OrderLine> findByOrderIdAndStatus(Long orderId, String status);
}
