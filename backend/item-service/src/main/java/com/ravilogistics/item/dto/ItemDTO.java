package com.ravilogistics.item.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemDTO {
    private Long itemId;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Item code is required")
    private String itemCode;

    @NotBlank(message = "Item name is required")
    private String itemName;

    private String description;
    private String uom;
    private BigDecimal unitWeight;
    private BigDecimal unitLength;
    private BigDecimal unitWidth;
    private BigDecimal unitHeight;
    private BigDecimal unitCost;
    private BigDecimal unitPrice;
    private String category;
    private String subCategory;
    private String barcode;
    private Boolean lotControlled;
    private Boolean serialControlled;
    private Boolean isActive;
}
