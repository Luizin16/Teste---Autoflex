package com.autoflex.inventory.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "raw_material")
public class RawMaterial extends PanacheEntity {

    @NotBlank
    @Column(name = "code", nullable = false, unique = true, length = 50)
    public String code;

    @NotBlank
    @Column(name = "name", nullable = false, length = 200)
    public String name;

    @NotNull
    @Min(0)
    @Column(name = "stock_quantity", nullable = false)
    public Long stockQuantity;
}
