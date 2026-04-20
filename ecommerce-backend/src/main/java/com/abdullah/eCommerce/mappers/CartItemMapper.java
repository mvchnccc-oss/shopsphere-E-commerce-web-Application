package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.CartItem;
import com.abdullah.eCommerce.domain.dtos.CartItemDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface CartItemMapper {
    CartItemDto toCartItemDto(CartItem item);
}
