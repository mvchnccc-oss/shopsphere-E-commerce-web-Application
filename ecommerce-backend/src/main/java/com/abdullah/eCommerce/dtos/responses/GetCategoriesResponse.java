package com.abdullah.eCommerce.dtos.responses;

import com.abdullah.eCommerce.dtos.CategoryDto;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class GetCategoriesResponse {
    public List<CategoryDto> categories;
}
