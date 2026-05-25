package com.ravilogistics.inventory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class InventoryReceiptDTO {
    @NotNull private Long customerId;
    @NotNull private Long warehouseId;
    @NotNull private Long itemId;
    @NotNull private Long locationId;
    @NotNull private BigDecimal quantity;
    private String lotNumber;
    private String uom;
    private String referenceType;
    private Long referenceId;
    private String createdBy;
}
