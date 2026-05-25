package com.ravilogistics.asn.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asn_lines")
@Data
public class AsnLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long asnLineId;

    @Column(nullable = false)
    private Long asnId;

    @Column(nullable = false)
    private Integer lineNumber;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false, precision = 18, scale = 4)
    private BigDecimal expectedQty;

    @Column(precision = 18, scale = 4)
    private BigDecimal receivedQty = BigDecimal.ZERO;

    @Column(length = 50)
    private String lotNumber;

    private LocalDate expiryDate;

    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (receivedQty == null) receivedQty = BigDecimal.ZERO;
        if (status == null) status = "PENDING";
    }
}
