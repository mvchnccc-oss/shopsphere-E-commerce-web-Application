package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.CategoryDto;
import com.abdullah.eCommerce.dtos.responses.GetCategoriesResponse;
import com.abdullah.eCommerce.dtos.responses.GetCategoryResponse;
import com.abdullah.eCommerce.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public GetCategoriesResponse getCategories() {
        List<CategoryDto> categories = categoryService.getCategories();

        return new GetCategoriesResponse(categories);
    }

    @GetMapping("{id}")
    public GetCategoryResponse getCategory(@PathVariable Long id) {
        CategoryDto category = categoryService.getCategory(id);

        return new GetCategoryResponse(category);
    }
}
