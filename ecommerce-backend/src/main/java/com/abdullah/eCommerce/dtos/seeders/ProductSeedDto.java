package com.abdullah.eCommerce.dtos.seeders;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSeedDto {
    private String title;
    private BigDecimal price;
    private String description;
    private List<String> images;
    private CategorySeedDto category;
}
