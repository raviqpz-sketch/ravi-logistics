package com.ravilogistics.wave.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "wave_orders")
public class WaveOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wave_order_id")
    private Long waveOrderId;

    @Column(name = "wave_id", nullable = false)
    private Long waveId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
