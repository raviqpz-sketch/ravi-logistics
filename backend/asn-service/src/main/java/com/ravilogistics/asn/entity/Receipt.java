package com.ravilogistics.asn.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "receipts")
@Data
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long receiptId;

    @Column(nullable = false)
    private Long asnId;

    @Column(nullable = false, unique = true, length = 30)
    private String receiptNumber;

    @Column(nullable = false)
    private Long warehouseId;

    private LocalDateTime receivedDate;

    @Column(length = 100)
    private String receivedBy;

    @Column(length = 20)
    private String dockDoor;

    @Column(nullable = false, length = 20)
    private String status = "OPEN";

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "OPEN";
        if (receivedDate == null) receivedDate = LocalDateTime.now();
    }
}
