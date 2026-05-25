package com.ravilogistics.pack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddBoxDTO {

    @NotNull(message = "Pack task ID is required")
    private Long packTaskId;

    private String boxType;

    private BigDecimal length;

    private BigDecimal width;

    private BigDecimal height;
}
