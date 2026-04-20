package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.Category;
import com.abdullah.eCommerce.domain.Product;
import com.abdullah.eCommerce.domain.dtos.CategoryDto;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(source = "products", target = "totalProducts", qualifiedByName = "countProducts")
    @Mapping(source = "image", target = "image")
    CategoryDto toDto(Category category);

    @Named("countProducts")
    default Integer countProducts(Set<Product> products) {
        if (products == null) return 0;
        return products.size();
    }


}
