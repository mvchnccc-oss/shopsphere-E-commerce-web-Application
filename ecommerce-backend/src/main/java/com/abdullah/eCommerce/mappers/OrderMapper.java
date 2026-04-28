package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.OrderDto;
import com.abdullah.eCommerce.entities.Order;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, AddressMapper.class})
public interface OrderMapper {
    OrderDto toDto(Order order);


    List<OrderDto> toOrdersDto(List<Order> orders);
}
