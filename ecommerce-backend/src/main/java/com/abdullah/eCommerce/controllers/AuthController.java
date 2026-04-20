package com.abdullah.eCommerce.controllers;


import com.abdullah.eCommerce.domain.User;
import com.abdullah.eCommerce.domain.dtos.*;
import com.abdullah.eCommerce.mappers.UserMapper;
import com.abdullah.eCommerce.security.ProductUserDetails;
import com.abdullah.eCommerce.services.AuthenticationService;
import com.abdullah.eCommerce.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth/")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserMapper userMapper;
    private final UserService userService;

    @Value("${jwt.expiry}")
    private Long expiresAt;

    @PostMapping("login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody @Valid AuthenticationRequest request
            ){
        UserDetails user = authenticationService.authenticate(request.getEmail(), request.getPassword());

        String token = authenticationService.generateToken(user);

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .token(token)
                        .expiresAt(expiresAt)
                        .build()
        );
    }

    @GetMapping("me")
    public ResponseEntity<UserDto> getUser(){
        return ResponseEntity.ok(
                userMapper.toUserDto(
                        userService.getUser()
                )
        );
    }

    @PostMapping("me")
    public ResponseEntity<UpdateUserResponseDto> updateUser(
            @Valid @RequestBody UpdateUserRequestDto user
            ){
        User updatedUser =  userService.updateUser(userMapper.toUser(user));
        String token = authenticationService.generateToken(new ProductUserDetails(updatedUser));
        AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                .token(token)
                .expiresAt(expiresAt)
                .build();
        return ResponseEntity.ok(
                UpdateUserResponseDto.builder()
                        .user(userMapper.toUserDto(updatedUser))
                        .auth(authenticationResponse)
                        .build()
        );
    }

    @PostMapping("signup")
    public ResponseEntity<AuthenticationResponse> signup(
            @RequestBody @Valid SignupAuthenticationRequest request
    ){
        UserDetails user = authenticationService.createUser(request.getEmail(), request.getPassword(), request.getName());

        String token = authenticationService.generateToken(user);

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .token(token)
                        .expiresAt(expiresAt)
                        .build()
        );
    }
}
