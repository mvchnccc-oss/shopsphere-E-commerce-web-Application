package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.OrderItem;
import com.abdullah.eCommerce.domain.dtos.OrderItemDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.title", target = "productTitle")
    OrderItemDto toOrderItemDto(OrderItem orderItem);
}
