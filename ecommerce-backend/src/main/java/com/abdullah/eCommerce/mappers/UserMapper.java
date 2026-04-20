package com.abdullah.eCommerce.mappers;

import com.abdullah.eCommerce.domain.User;
import com.abdullah.eCommerce.domain.dtos.UpdateUserRequestDto;
import com.abdullah.eCommerce.domain.dtos.UserDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toUserDto(User user);
    User toUser(UpdateUserRequestDto user);
}
