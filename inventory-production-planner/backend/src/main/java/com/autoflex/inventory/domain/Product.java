package com.autoflex.inventory.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "product")
public class Product extends PanacheEntity {

    @NotBlank
    @Column(name = "code", nullable = false, unique = true, length = 50)
    public String code;

    @NotBlank
    @Column(name = "name", nullable = false, length = 200)
    public String name;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "price", nullable = false, precision = 19, scale = 2)
    public BigDecimal price;
}
