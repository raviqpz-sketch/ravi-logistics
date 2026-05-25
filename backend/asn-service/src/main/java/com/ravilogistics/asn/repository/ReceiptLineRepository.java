package com.ravilogistics.asn.repository;

import com.ravilogistics.asn.entity.ReceiptLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReceiptLineRepository extends JpaRepository<ReceiptLine, Long> {
    List<ReceiptLine> findByReceiptId(Long receiptId);
    List<ReceiptLine> findByAsnLineId(Long asnLineId);
    List<ReceiptLine> findByItemId(Long itemId);
}
