package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.dtos.UserDto;
import com.abdullah.eCommerce.dtos.requests.LoginRequest;
import com.abdullah.eCommerce.dtos.requests.RegisterRequest;
import com.abdullah.eCommerce.dtos.requests.UpdateUserRequest;
import com.abdullah.eCommerce.dtos.responses.AuthResponse;
import com.abdullah.eCommerce.dtos.responses.UpdateUserResponse;
import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.mappers.UserMapper;
import com.abdullah.eCommerce.security.UserPrincipal;
import com.abdullah.eCommerce.services.AuthenticationService;
import com.abdullah.eCommerce.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth/")
public class AuthController {
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final UserMapper userMapper;

    @Value("${jwt.expiry}")
    private Long expiresAt;

    @PostMapping("login")
    public AuthResponse login(@RequestBody @Valid LoginRequest body) {
        UserDetails user = authenticationService.authenticate(body.email, body.password);
        String token = authenticationService.generateToken(user);

        return new AuthResponse(token, expiresAt);
    }

    @PostMapping("signup")
    public AuthResponse signup(@RequestBody @Valid RegisterRequest body) {
        UserDetails user = authenticationService.createUser(body.email, body.password, body.name);
        String token = authenticationService.generateToken(user);

        return new AuthResponse(token, expiresAt);
    }

    @GetMapping("me")
    public UserDto getUser() {
        return userMapper.toUserDto(userService.getUser());
    }

    @PostMapping("me")
    public UpdateUserResponse updateUser(@RequestBody @Valid UpdateUserRequest body) {
        User updatedUser = userService.updateUser(userMapper.toUser(body));

        String token = authenticationService.generateToken(new UserPrincipal(updatedUser));
        AuthResponse authResponse = new AuthResponse(token, expiresAt);

        return new UpdateUserResponse(userMapper.toUserDto(updatedUser), authResponse);
    }
}
