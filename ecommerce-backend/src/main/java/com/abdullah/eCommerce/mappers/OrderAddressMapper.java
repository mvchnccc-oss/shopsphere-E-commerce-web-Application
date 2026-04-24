package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.OrderAddress;
import com.abdullah.eCommerce.domain.dtos.OrderAddressDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderAddressMapper {
    OrderAddressDto toDto(OrderAddress orderAddress);
}
