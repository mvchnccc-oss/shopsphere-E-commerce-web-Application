package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.OrderItem;
import com.abdullah.eCommerce.domain.dtos.OrderItemDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItemDto toOrderItemDto(OrderItem orderItem);
}
