package com.ravilogistics.order.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "order_lines")
public class OrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_line_id")
    private Long orderLineId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "line_number")
    private Integer lineNumber;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "ordered_qty", precision = 18, scale = 4)
    private BigDecimal orderedQty;

    @Column(name = "allocated_qty", precision = 18, scale = 4)
    private BigDecimal allocatedQty = BigDecimal.ZERO;

    @Column(name = "picked_qty", precision = 18, scale = 4)
    private BigDecimal pickedQty = BigDecimal.ZERO;

    @Column(name = "packed_qty", precision = 18, scale = 4)
    private BigDecimal packedQty = BigDecimal.ZERO;

    @Column(name = "shipped_qty", precision = 18, scale = 4)
    private BigDecimal shippedQty = BigDecimal.ZERO;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.allocatedQty == null) {
            this.allocatedQty = BigDecimal.ZERO;
        }
        if (this.pickedQty == null) {
            this.pickedQty = BigDecimal.ZERO;
        }
        if (this.packedQty == null) {
            this.packedQty = BigDecimal.ZERO;
        }
        if (this.shippedQty == null) {
            this.shippedQty = BigDecimal.ZERO;
        }
        if (this.status == null) {
            this.status = "CREATED";
        }
    }
}
