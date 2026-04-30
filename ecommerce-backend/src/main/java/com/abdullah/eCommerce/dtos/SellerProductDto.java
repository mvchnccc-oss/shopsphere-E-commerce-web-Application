package com.abdullah.eCommerce.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SellerProductDto {
    private Long id;
    private String title;
    private BigDecimal price;
    private CategoryDto category;
    private String description;
    private List<String> images;
}
