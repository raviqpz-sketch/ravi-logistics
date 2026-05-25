package com.ravilogistics.shipment.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "carriers")
public class Carrier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "carrier_id")
    private Long carrierId;

    @Column(name = "carrier_code", nullable = false, unique = true)
    private String carrierCode;

    @Column(name = "carrier_name", nullable = false)
    private String carrierName;

    @Column(name = "service_level")
    private String serviceLevel;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
