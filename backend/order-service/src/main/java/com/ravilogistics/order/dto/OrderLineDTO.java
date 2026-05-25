package com.ravilogistics.order.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderLineDTO {
    @NotNull private Long itemId;
    @NotNull private BigDecimal orderedQty;
}
