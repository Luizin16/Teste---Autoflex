package com.autoflex.inventory.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class BomItemRequest {
    @NotNull public Long rawMaterialId;
    @NotNull @Min(1) public Long requiredQuantity;
}
