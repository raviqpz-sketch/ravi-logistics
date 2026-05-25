package com.ravilogistics.shipment.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "shipment_boxes")
public class ShipmentBox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipment_box_id")
    private Long shipmentBoxId;

    @Column(name = "shipment_id", nullable = false)
    private Long shipmentId;

    @Column(name = "box_id", nullable = false)
    private Long boxId;

    @Column(name = "box_label")
    private String boxLabel;

    @Column(name = "weight", precision = 10, scale = 2)
    private BigDecimal weight;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
