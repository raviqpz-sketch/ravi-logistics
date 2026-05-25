package com.ravilogistics.item.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "items")
@Data
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @NotNull
    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String itemCode;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String itemName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 20)
    private String uom = "EA";

    private BigDecimal unitWeight;
    private BigDecimal unitLength;
    private BigDecimal unitWidth;
    private BigDecimal unitHeight;
    private BigDecimal unitCost;
    private BigDecimal unitPrice;
    private String category;
    private String subCategory;
    private String barcode;
    private Boolean lotControlled = false;
    private Boolean serialControlled = false;
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
