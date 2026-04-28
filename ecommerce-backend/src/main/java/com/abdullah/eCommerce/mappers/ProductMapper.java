package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.entities.ProductImage;
import org.mapstruct.Mapper;

import java.util.Collections;
import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface ProductMapper {
    ProductDto toDto(Product product);

    List<ProductDto> toDtoList(List<Product> products);

    default List<String> fromProductImages(List<ProductImage> images) {
        if (images == null) return Collections.emptyList();
        
        return images.stream()
                .map(item -> item.getId().getImage())
                .toList();
    }
}
