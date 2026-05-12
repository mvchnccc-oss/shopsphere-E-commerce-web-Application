package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.OrderItemDto;
import com.abdullah.eCommerce.entities.CartItem;
import com.abdullah.eCommerce.entities.Order;
import com.abdullah.eCommerce.entities.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.title", target = "productTitle")
    OrderItemDto toDto(OrderItem orderItem);

    @Mapping(ignore = true, target = "id")
    @Mapping(target = "order", source = "order")
    @Mapping(target = "product", source = "item.product")
    @Mapping(target = "quantity", source = "item.quantity")
    @Mapping(target = "pricePerUnit", source = "item.product.price")
    OrderItem fromCartItem(CartItem item, Order order);

    default List<OrderItem> fromCartItems(List<CartItem> items, Order order) {
        return items.stream()
            .map(item -> fromCartItem(item, order))
            .toList();
    }
}
