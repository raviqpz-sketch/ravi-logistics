package com.ravilogistics.pack.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pack_box_items")
public class PackBoxItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "box_item_id")
    private Long boxItemId;

    @Column(name = "box_id", nullable = false)
    private Long boxId;

    @Column(name = "order_line_id", nullable = false)
    private Long orderLineId;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(name = "packed_qty", nullable = false, precision = 19, scale = 4)
    private BigDecimal packedQty;

    @Column(name = "lot_number")
    private String lotNumber;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
