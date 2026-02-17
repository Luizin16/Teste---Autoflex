package com.autoflex.inventory.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RawMaterialRequest {
    @NotBlank public String code;
    @NotBlank public String name;
    @NotNull @Min(0) public Long stockQuantity;
}
