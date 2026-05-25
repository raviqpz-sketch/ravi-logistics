package com.ravilogistics.pick.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pick_tasks")
public class PickTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pick_task_id")
    private Long pickTaskId;

    @Column(name = "wave_id")
    private Long waveId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_line_id")
    private Long orderLineId;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "pick_location_id")
    private Long pickLocationId;

    @Column(name = "pick_qty", precision = 19, scale = 4)
    private BigDecimal pickQty;

    @Column(name = "confirmed_qty", precision = 19, scale = 4)
    private BigDecimal confirmedQty = BigDecimal.ZERO;

    @Column(name = "lot_number")
    private String lotNumber;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "picker_id")
    private String pickerId;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (confirmedQty == null) {
            confirmedQty = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
