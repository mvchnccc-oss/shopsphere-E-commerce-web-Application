package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.dtos.UserDto;
import com.abdullah.eCommerce.dtos.requests.UpdateUserRequest;
import com.abdullah.eCommerce.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toUserDto(User user);

    User toUser(UpdateUserRequest user);
}
