package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.Order;
import com.abdullah.eCommerce.domain.dtos.OrderDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {
    OrderDto toDto(Order order);

    List<OrderDto> toOrdersDto(List<Order> orders);
}
