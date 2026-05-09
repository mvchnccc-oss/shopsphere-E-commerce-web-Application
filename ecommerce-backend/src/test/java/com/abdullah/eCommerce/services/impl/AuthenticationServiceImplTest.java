package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.entities.UserRole;
import com.abdullah.eCommerce.exceptions.UserAlreadyExistsException;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.security.AppUserDetailsService;
import com.abdullah.eCommerce.security.UserPrincipal;
import com.abdullah.eCommerce.services.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private AppUserDetailsService appUserDetailsService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        authenticationService = new AuthenticationServiceImpl(
            authenticationManager,
            appUserDetailsService,
            userRepository,
            passwordEncoder
        );

        ReflectionTestUtils.setField(authenticationService, "secretKey",
            "thisisaverylongsecretkeyforjwttoken12345678");
        ReflectionTestUtils.setField(authenticationService, "jwtExpiryMs", 3600000L);
    }

    @Nested
    @DisplayName("Create User")
    class CreateUser {

        @Test
        @DisplayName("Success")
        void createUser() {
            when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode("password")).thenReturn("encodedPassword");

            UserDetails result = authenticationService.createUser(
                "test@test.com", "password", "Test User"
            );

            assertNotNull(result);
            assertEquals("test@test.com", result.getUsername());
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("User Already Exists")
        void createUserAlreadyExists() {
            User existing = User.builder().email("test@test.com").build();
            when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(existing));

            assertThrows(UserAlreadyExistsException.class, () ->
                authenticationService.createUser("test@test.com", "password", "Test User"));

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Authenticate")
    class Authenticate {

        @Test
        @DisplayName("Success")
        void authenticate() {
            User user = User.builder()
                .id(1L)
                .email("test@test.com")
                .password("encodedPassword")
                .role(UserRole.Customer)
                .build();

            UserPrincipal userPrincipal = new UserPrincipal(user);

            when(appUserDetailsService.loadUserByUsername("test@test.com")).thenReturn(userPrincipal);

            UserDetails result = authenticationService.authenticate("test@test.com", "password");

            assertNotNull(result);
            assertEquals("test@test.com", result.getUsername());
            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }
    }

    @Nested
    @DisplayName("Generate Token")
    class GenerateToken {

        @Test
        @DisplayName("Valid Token")
        void generateToken() {
            User user = User.builder()
                .id(1L)
                .email("test@test.com")
                .role(UserRole.Customer)
                .build();

            UserPrincipal userPrincipal = new UserPrincipal(user);

            String token = authenticationService.generateToken(userPrincipal);

            assertNotNull(token);
            assertFalse(token.isEmpty());
        }
    }

    @Nested
    @DisplayName("Validate Token")
    class ValidateToken {

        @Test
        @DisplayName("Valid Token")
        void validateToken() {
            User user = User.builder()
                .id(1L)
                .email("test@test.com")
                .role(UserRole.Customer)
                .build();

            UserPrincipal userPrincipal = new UserPrincipal(user);

            when(appUserDetailsService.loadUserByUsername("test@test.com")).thenReturn(userPrincipal);

            String token = authenticationService.generateToken(userPrincipal);
            UserDetails result = authenticationService.validateToken(token);

            assertNotNull(result);
            assertEquals("test@test.com", result.getUsername());
        }
    }
}