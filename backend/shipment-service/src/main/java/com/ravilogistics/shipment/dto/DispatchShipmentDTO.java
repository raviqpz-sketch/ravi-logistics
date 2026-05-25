package com.ravilogistics.shipment.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DispatchShipmentDTO {

    private String shippedBy;

    private LocalDate shipDate;

    private BigDecimal freightCost;
}
