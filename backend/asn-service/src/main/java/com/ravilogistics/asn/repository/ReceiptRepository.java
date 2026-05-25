package com.ravilogistics.asn.repository;

import com.ravilogistics.asn.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    List<Receipt> findByAsnIdOrderByCreatedAtDesc(Long asnId);
    Optional<Receipt> findByReceiptNumber(String receiptNumber);
    List<Receipt> findByWarehouseIdAndStatus(Long warehouseId, String status);
    Optional<Receipt> findByAsnIdAndStatus(Long asnId, String status);
}
