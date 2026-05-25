package com.ravilogistics.order.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_number", nullable = false, unique = true, length = 100)
    private String orderNumber;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "required_ship_date")
    private LocalDate requiredShipDate;

    @Column(name = "ship_to_name", length = 200)
    private String shipToName;

    @Column(name = "ship_to_address1", length = 300)
    private String shipToAddress1;

    @Column(name = "ship_to_address2", length = 300)
    private String shipToAddress2;

    @Column(name = "ship_to_city", length = 100)
    private String shipToCity;

    @Column(name = "ship_to_state", length = 100)
    private String shipToState;

    @Column(name = "ship_to_country", length = 100)
    private String shipToCountry;

    @Column(name = "ship_to_zip", length = 20)
    private String shipToZip;

    @Column(name = "carrier_id")
    private Long carrierId;

    @Column(name = "service_level", length = 50)
    private String serviceLevel;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "priority")
    private Integer priority = 5;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.orderDate == null) {
            this.orderDate = LocalDate.now();
        }
        if (this.status == null) {
            this.status = "CREATED";
        }
        if (this.priority == null) {
            this.priority = 5;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
