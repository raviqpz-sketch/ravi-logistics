package com.ravilogistics.item.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
@Data
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long warehouseId;

    @Column(nullable = false, unique = true, length = 20)
    private String warehouseCode;

    @Column(nullable = false, length = 100)
    private String warehouseName;

    private String addressLine1;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    @Column(precision = 10, scale = 2)
    private BigDecimal totalSqft;
    private Boolean isActive = true;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}
