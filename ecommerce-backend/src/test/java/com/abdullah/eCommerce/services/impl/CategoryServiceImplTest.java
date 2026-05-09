package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.dtos.CategoryDto;
import com.abdullah.eCommerce.entities.Category;
import com.abdullah.eCommerce.exceptions.CategoryNotFoundException;
import com.abdullah.eCommerce.mappers.CategoryMapper;
import com.abdullah.eCommerce.mappers.CategoryMapperImpl;
import com.abdullah.eCommerce.repositories.CategoryRepository;
import com.abdullah.eCommerce.services.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@Import({CategoryMapperImpl.class})
class CategoryServiceImplTest {

    @Autowired
    private CategoryMapper categoryMapper;

    @Mock
    private CategoryRepository categoryRepository;

    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        categoryService = new CategoryServiceImpl(
            categoryRepository,
            categoryMapper
        );
    }

    @Nested
    @DisplayName("Get Categories")
    class GetCategories {

        @Test
        @DisplayName("All")
        void getCategories() {
            List<Category> categories = IntStream.rangeClosed(1, 5)
                .mapToObj(i -> Category.builder()
                    .id((long) i)
                    .name("Category " + i)
                    .build())
                .toList();

            when(categoryRepository.findAll()).thenReturn(categories);

            List<CategoryDto> result = categoryService.getCategories();

            assertEquals(5, result.size());
            verify(categoryRepository).findAll();
        }

        @Test
        @DisplayName("Empty")
        void getCategoriesEmpty() {
            when(categoryRepository.findAll()).thenReturn(Collections.emptyList());

            List<CategoryDto> result = categoryService.getCategories();

            assertTrue(result.isEmpty());
            verify(categoryRepository).findAll();
        }
    }

    @Nested
    @DisplayName("Get Category")
    class GetCategory {

        @Test
        @DisplayName("By Id")
        void getCategory() {
            Category category = Category.builder()
                .id(1L)
                .name("Electronics")
                .build();

            when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

            CategoryDto result = categoryService.getCategory(1L);

            assertNotNull(result);
            assertEquals("Electronics", result.getName());
            verify(categoryRepository).findById(1L);
        }

        @Test
        @DisplayName("Not Found")
        void getCategoryNotFound() {
            when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

            assertThrows(CategoryNotFoundException.class, () -> categoryService.getCategory(1L));

            verify(categoryRepository).findById(1L);
        }
    }
}