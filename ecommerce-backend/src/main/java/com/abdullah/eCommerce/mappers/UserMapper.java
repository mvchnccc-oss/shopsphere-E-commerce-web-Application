package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.UserDto;
import com.abdullah.eCommerce.dtos.requests.UpdateUserRequest;
import com.abdullah.eCommerce.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toUserDto(User user);

    @Mapping(source = "user.isSeller", target = "isSeller")
    User toUser(UpdateUserRequest user);
}
