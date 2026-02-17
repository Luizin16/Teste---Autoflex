package com.autoflex.inventory.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ProductRequest {
    @NotBlank public String code;
    @NotBlank public String name;
    @NotNull @DecimalMin("0.00") public BigDecimal price;
}
