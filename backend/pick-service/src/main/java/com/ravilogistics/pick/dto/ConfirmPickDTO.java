package com.ravilogistics.pick.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ConfirmPickDTO {

    @NotNull(message = "Confirmed quantity is required")
    private BigDecimal confirmedQty;

    private String pickedBy;

    private String pickMethod;

    private String notes;
}
