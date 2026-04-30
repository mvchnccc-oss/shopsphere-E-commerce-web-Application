package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.ProductDto;
import com.abdullah.eCommerce.dtos.SellerProductDto;
import com.abdullah.eCommerce.entities.Product;
import com.abdullah.eCommerce.entities.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface ProductMapper {
    @Mapping(source = "product.seller.name", target = "seller")
    ProductDto toDto(Product product);

    SellerProductDto toSellerDto(Product productDto);

    List<ProductDto> toDtoList(List<Product> products);

    List<SellerProductDto> toSellerDtoList(List<Product> products);

    default List<String> fromProductImages(List<ProductImage> images) {
        if (images == null) return Collections.emptyList();

        return images.stream()
                .map(item -> item.getId().getImage())
                .toList();
    }
}
