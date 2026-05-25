package com.ravilogistics.inventory.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "lot_number")
    private String lotNumber;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "on_hand_qty", precision = 18, scale = 4)
    private BigDecimal onHandQty;

    @Column(name = "reserved_qty", precision = 18, scale = 4)
    private BigDecimal reservedQty;

    @Column(name = "uom", length = 10)
    private String uom = "EA";

    /**
     * available_qty is a generated column in the DB (on_hand_qty - reserved_qty).
     * Mapped as read-only — never inserted or updated by JPA.
     */
    @Column(name = "available_qty", insertable = false, updatable = false, precision = 18, scale = 4)
    private BigDecimal availableQty;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.uom == null) {
            this.uom = "EA";
        }
        if (this.onHandQty == null) {
            this.onHandQty = BigDecimal.ZERO;
        }
        if (this.reservedQty == null) {
            this.reservedQty = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
