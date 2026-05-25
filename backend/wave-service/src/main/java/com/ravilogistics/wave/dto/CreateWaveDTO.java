package com.ravilogistics.wave.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateWaveDTO {

    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    @NotNull(message = "Order IDs are required")
    private List<Long> orderIds;

    private String createdBy;
}
