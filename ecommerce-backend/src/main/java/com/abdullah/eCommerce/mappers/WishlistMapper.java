package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.Wishlist;
import com.abdullah.eCommerce.domain.dtos.WishlistDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WishlistMapper {
    @Mapping(source = "id.productId", target = "productId")
    WishlistDto toDto(Wishlist wishlist);

    List<WishlistDto> toDtoList(List<Wishlist> wishlist);
}
