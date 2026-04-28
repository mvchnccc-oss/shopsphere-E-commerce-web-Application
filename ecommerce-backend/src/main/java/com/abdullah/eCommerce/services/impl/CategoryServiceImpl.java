package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.CategoryDto;
import com.abdullah.eCommerce.entities.Category;
import com.abdullah.eCommerce.exceptions.CategoryNotFoundException;
import com.abdullah.eCommerce.mappers.CategoryMapper;
import com.abdullah.eCommerce.repositories.CategoryRepository;
import com.abdullah.eCommerce.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryDto> getCategories() {
        List<Category> categories = categoryRepository.findAll();

        return categoryMapper.toDtoList(categories);
    }

    @Override
    public CategoryDto getCategory(Long id) {
        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        return categoryMapper.toDto(category);
    }
}
