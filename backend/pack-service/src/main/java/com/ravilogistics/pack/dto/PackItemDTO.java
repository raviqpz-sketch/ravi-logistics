package com.ravilogistics.pack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PackItemDTO {

    @NotNull(message = "Box ID is required")
    private Long boxId;

    @NotNull(message = "Order line ID is required")
    private Long orderLineId;

    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotNull(message = "Packed quantity is required")
    private BigDecimal packedQty;

    private String lotNumber;
}
