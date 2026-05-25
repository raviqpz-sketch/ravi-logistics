package com.ravilogistics.pack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePackTaskDTO {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    private String stationCode;
}
