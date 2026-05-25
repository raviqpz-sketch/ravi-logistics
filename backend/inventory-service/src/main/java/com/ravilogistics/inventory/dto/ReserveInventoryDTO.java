package com.ravilogistics.inventory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ReserveInventoryDTO {
    @NotNull private Long itemId;
    @NotNull private Long customerId;
    @NotNull private BigDecimal quantity;
    private String referenceType;
    private Long referenceId;
}
