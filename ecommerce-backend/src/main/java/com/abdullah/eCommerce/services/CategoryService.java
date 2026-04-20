package com.abdullah.eCommerce.services;

import com.abdullah.eCommerce.domain.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getCategories();

    Category getCategory(Integer id);
}
