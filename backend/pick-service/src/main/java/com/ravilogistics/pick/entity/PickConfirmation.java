package com.ravilogistics.pick.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pick_confirmations")
public class PickConfirmation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "confirmation_id")
    private Long confirmationId;

    @Column(name = "pick_task_id", nullable = false)
    private Long pickTaskId;

    @Column(name = "confirmed_qty", nullable = false, precision = 19, scale = 4)
    private BigDecimal confirmedQty;

    @Column(name = "picked_by")
    private String pickedBy;

    @Column(name = "pick_method")
    private String pickMethod;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
