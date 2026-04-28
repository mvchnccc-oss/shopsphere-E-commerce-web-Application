package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.dtos.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getCategories();

    CategoryDto getCategory(Long id);
}
