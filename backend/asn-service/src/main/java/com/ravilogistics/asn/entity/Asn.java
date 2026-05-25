package com.ravilogistics.asn.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asns")
@Data
public class Asn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long asnId;

    @Column(nullable = false, unique = true, length = 30)
    private String asnNumber;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Long warehouseId;

    @Column(length = 200)
    private String supplierName;

    @Column(length = 100)
    private String supplierRef;

    @Column(nullable = false)
    private LocalDate expectedDate;

    @Column(nullable = false, length = 20)
    private String status = "DRAFT";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 100)
    private String createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "DRAFT";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
