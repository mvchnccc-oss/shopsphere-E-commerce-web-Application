package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.CartItemDto;
import com.abdullah.eCommerce.entities.CartItem;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface CartItemMapper {
    CartItemDto toDto(CartItem item);

    List<CartItemDto> toDtoList(List<CartItem> cartItems);
}
