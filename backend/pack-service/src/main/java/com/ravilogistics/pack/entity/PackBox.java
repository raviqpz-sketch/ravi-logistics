package com.ravilogistics.pack.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pack_boxes")
public class PackBox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "box_id")
    private Long boxId;

    @Column(name = "pack_task_id", nullable = false)
    private Long packTaskId;

    @Column(name = "box_sequence")
    private Integer boxSequence;

    @Column(name = "box_type")
    private String boxType;

    @Column(name = "length", precision = 10, scale = 2)
    private BigDecimal length;

    @Column(name = "width", precision = 10, scale = 2)
    private BigDecimal width;

    @Column(name = "height", precision = 10, scale = 2)
    private BigDecimal height;

    @Column(name = "gross_weight", precision = 10, scale = 2)
    private BigDecimal grossWeight;

    @Column(name = "is_closed")
    private Boolean isClosed = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isClosed == null) {
            isClosed = false;
        }
    }
}
