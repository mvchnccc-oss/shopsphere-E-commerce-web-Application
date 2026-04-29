package com.abdullah.eCommerce.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
public class CreateProductRequest {
    @NotBlank
    public String title;

    @NotBlank
    public String description;

    @NotNull
    @Min(0)
    public BigDecimal price;

    @NotNull
    public String category;

    public List<String> images;
}
