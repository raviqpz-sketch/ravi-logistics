package com.ravilogistics.asn.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AsnDTO {
    @NotBlank(message = "ASN number is required")
    private String asnNumber;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    private String supplierName;
    private String supplierRef;

    @NotNull(message = "Expected date is required")
    private LocalDate expectedDate;

    private String status;
    private String notes;
    private String createdBy;

    @Valid
    private List<AsnLineDTO> lines;
}
