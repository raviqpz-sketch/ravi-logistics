package com.ravilogistics.pack.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pack_tasks")
public class PackTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pack_task_id")
    private Long packTaskId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "warehouse_id", nullable = false)
    private Long warehouseId;

    @Column(name = "station_code")
    private String stationCode;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "packer_id")
    private String packerId;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

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
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
