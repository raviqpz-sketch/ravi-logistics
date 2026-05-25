package com.ravilogistics.shipment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddShipmentBoxDTO {

    @NotNull(message = "Shipment ID is required")
    private Long shipmentId;

    @NotNull(message = "Box ID is required")
    private Long boxId;

    private String boxLabel;

    private BigDecimal weight;
}
