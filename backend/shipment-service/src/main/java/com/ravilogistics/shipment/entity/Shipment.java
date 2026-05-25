package com.ravilogistics.shipment.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipment_id")
    private Long shipmentId;

    @Column(name = "shipment_number", nullable = false, unique = true)
    private String shipmentNumber;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "pack_task_id")
    private Long packTaskId;

    @Column(name = "carrier_id")
    private Long carrierId;

    @Column(name = "carrier_name")
    private String carrierName;

    @Column(name = "service_level")
    private String serviceLevel;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "ship_date")
    private LocalDate shipDate;

    @Column(name = "estimated_delivery")
    private LocalDate estimatedDelivery;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "total_weight", precision = 10, scale = 2)
    private BigDecimal totalWeight;

    @Column(name = "total_boxes")
    private Integer totalBoxes = 0;

    @Column(name = "freight_cost", precision = 10, scale = 2)
    private BigDecimal freightCost;

    @Column(name = "shipped_by")
    private String shippedBy;

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (totalBoxes == null) {
            totalBoxes = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
