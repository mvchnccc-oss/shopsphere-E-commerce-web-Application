package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.domain.dtos.CategoryDto;
import com.abdullah.eCommerce.mappers.CategoryMapper;
import com.abdullah.eCommerce.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final CategoryMapper categoryMapper;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories(){
        return ResponseEntity.ok(
                categoryService.getCategories().stream().map(
                        categoryMapper::toDto
                ).toList()
        );
    }


    @GetMapping("{id}")
    public ResponseEntity<CategoryDto> getCategory(
            @PathVariable Integer id
    ){
        return ResponseEntity.ok(
                categoryMapper.toDto( categoryService.getCategory(id))
        );
    }

}
