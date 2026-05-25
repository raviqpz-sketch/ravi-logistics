package com.ravilogistics.asn.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AsnLineDTO {
    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotNull(message = "Expected quantity is required")
    @Positive(message = "Expected quantity must be positive")
    private BigDecimal expectedQty;

    private String lotNumber;
    private LocalDate expiryDate;
}
