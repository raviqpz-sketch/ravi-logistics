package com.ravilogistics.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateOrderDTO {
    @NotBlank private String orderNumber;
    @NotNull private Long customerId;
    @NotNull private Long warehouseId;
    @NotNull private LocalDate requiredShipDate;
    private String shipToName;
    private String shipToAddress1;
    private String shipToCity;
    private String shipToState;
    private String shipToZip;
    private Long carrierId;
    private String serviceLevel;
    private Integer priority;
    private String notes;
    @NotNull private List<OrderLineDTO> lines;
}
