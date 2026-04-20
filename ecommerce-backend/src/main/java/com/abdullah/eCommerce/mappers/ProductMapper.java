package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.Product;
import com.abdullah.eCommerce.domain.dtos.ProductDto;
import org.mapstruct.Mapper;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface ProductMapper {
    Product toProduct(ProductDto dto);
    ProductDto toProductDto(Product product);
}
