package com.ravilogistics.shipment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateShipmentDTO {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    private Long packTaskId;

    private Long carrierId;

    private String carrierName;

    private String serviceLevel;

    private String trackingNumber;

    private LocalDate estimatedDelivery;
}
