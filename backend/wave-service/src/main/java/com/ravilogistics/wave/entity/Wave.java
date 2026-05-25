package com.ravilogistics.wave.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "waves")
public class Wave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wave_id")
    private Long waveId;

    @Column(name = "wave_number", nullable = false, unique = true)
    private String waveNumber;

    @Column(name = "warehouse_id", nullable = false)
    private Long warehouseId;

    @Column(name = "wave_date")
    private LocalDate waveDate;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "total_orders")
    private Integer totalOrders;

    @Column(name = "total_lines")
    private Integer totalLines;

    @Column(name = "total_units", precision = 19, scale = 4)
    private BigDecimal totalUnits;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

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
        if (waveDate == null) {
            waveDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
