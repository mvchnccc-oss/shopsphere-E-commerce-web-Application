package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.Cart;
import com.abdullah.eCommerce.domain.CartItem;
import com.abdullah.eCommerce.domain.dtos.CartDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CartItemMapper.class})
public interface CartMapper {

    @Mapping(source = "items", target = "totalPrice", qualifiedByName = "calculateTotalPrice")
    @Mapping(source = "items", target = "totalProducts", qualifiedByName = "calculateTotalProducts")
    CartDto toCartDto(Cart cart);

    @Named("calculateTotalProducts")
    public static Integer calculateTotalProducts(List<CartItem> items){
        if (items == null) return 0;
        return items.size();
    }

    @Named("calculateTotalPrice")
    public static Long calculateTotalPrice(List<CartItem> items){
        Long totalPrice = 0L;
        if (items == null){
            return totalPrice;
        }
        for (CartItem item: items){
            totalPrice += item.getProduct().getPrice() * item.getQuantity();
        }
        return totalPrice;
    }
}
