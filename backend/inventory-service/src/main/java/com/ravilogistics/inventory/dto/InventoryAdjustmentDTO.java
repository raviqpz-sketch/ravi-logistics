package com.ravilogistics.inventory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class InventoryAdjustmentDTO {
    @NotNull private Long inventoryId;
    @NotNull private BigDecimal adjustmentQty;
    private String reason;
    private String adjustedBy;
}
