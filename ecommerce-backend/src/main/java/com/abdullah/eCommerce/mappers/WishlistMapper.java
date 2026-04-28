package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.WishlistDto;
import com.abdullah.eCommerce.entities.WishlistItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WishlistMapper {
    @Mapping(source = "id.productId", target = "productId")
    WishlistDto toDto(WishlistItem wishlist);

    List<WishlistDto> toDtoList(List<WishlistItem> wishlist);
}
