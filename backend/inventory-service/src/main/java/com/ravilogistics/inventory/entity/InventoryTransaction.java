package com.ravilogistics.inventory.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "txn_id")
    private Long txnId;

    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "txn_type", length = 50)
    private String txnType;

    @Column(name = "txn_qty", precision = 18, scale = 4)
    private BigDecimal txnQty;

    @Column(name = "before_qty", precision = 18, scale = 4)
    private BigDecimal beforeQty;

    @Column(name = "after_qty", precision = 18, scale = 4)
    private BigDecimal afterQty;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "lot_number")
    private String lotNumber;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
