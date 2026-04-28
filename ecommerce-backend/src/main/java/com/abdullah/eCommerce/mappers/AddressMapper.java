package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.AddressDto;
import com.abdullah.eCommerce.dtos.requests.PlaceOrderRequest;
import com.abdullah.eCommerce.entities.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressDto toDto(Address address);

    Address toAddress(PlaceOrderRequest address);
}
