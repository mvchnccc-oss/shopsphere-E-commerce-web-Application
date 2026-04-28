package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.CategoryDto;
import com.abdullah.eCommerce.entities.Category;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);

    List<CategoryDto> toDtoList(List<Category> category);
}
