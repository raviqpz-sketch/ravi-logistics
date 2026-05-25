package com.ravilogistics.asn.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "receipt_lines")
@Data
public class ReceiptLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long receiptLineId;

    @Column(nullable = false)
    private Long receiptId;

    @Column(nullable = false)
    private Long asnLineId;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false, precision = 18, scale = 4)
    private BigDecimal receivedQty;

    private Long putawayLocationId;

    @Column(length = 50)
    private String lotNumber;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
