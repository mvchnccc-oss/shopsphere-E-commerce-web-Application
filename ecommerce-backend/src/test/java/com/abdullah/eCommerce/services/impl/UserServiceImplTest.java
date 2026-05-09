package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.entities.UserRole;
import com.abdullah.eCommerce.exceptions.UserAlreadyExistsException;
import com.abdullah.eCommerce.repositories.UserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Spy
    @InjectMocks
    private UserServiceImpl userService;

    private MockedStatic<SecurityContextHolder> securityContextMock;

    @BeforeEach
    void setUp() {
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Authentication authentication = Mockito.mock(Authentication.class);

        securityContextMock = Mockito.mockStatic(SecurityContextHolder.class);
        securityContextMock.when(SecurityContextHolder::getContext).thenReturn(securityContext);
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(authentication.getName()).thenReturn("email");
    }

    @AfterEach
    void tearDown() {
        securityContextMock.close();
    }

    @Nested
    @DisplayName("Get User")
    class GetUser {

        @Test
        @DisplayName("By Email")
        void getUser() {
            when(userRepository.findByEmail("email"))
                .thenReturn(Optional.of(User.builder().email("email").build()));

            User user = userService.getUser();

            assertNotNull(user);
            assertEquals("email", user.getEmail());
            verify(userRepository).findByEmail("email");
        }

        @Test
        @DisplayName("Not Found")
        void getUserNotFound() {
            when(userRepository.findByEmail("email"))
                .thenReturn(Optional.empty());

            assertThrows(UsernameNotFoundException.class, () -> userService.getUser());
            verify(userRepository).findByEmail("email");
        }
    }

    @Nested
    @DisplayName("Update User")
    class UpdateUser {

        @Test
        @DisplayName("Success")
        void updateUser() {
            User repoUser = User.builder().name("name").email("email").role(UserRole.Customer).build();
            doReturn(repoUser).when(userService).getUser();

            User updatedUser = User.builder()
                .name("updatedName")
                .email("updatedEmail")
                .role(UserRole.Customer)
                .build();

            when(userRepository.findByEmail(updatedUser.getEmail())).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(repoUser);

            User result = userService.updateUser(updatedUser);

            assertNotNull(result);
            verify(userRepository).save(argThat(saved ->
                saved.getName().equals(updatedUser.getName()) &&
                    saved.getEmail().equals(updatedUser.getEmail()) &&
                    saved.getRole().equals(UserRole.Customer)
            ));
        }

        @Test
        @DisplayName("Same Email")
        void updateUserSameEmail() {
            User repoUser = User.builder().name("name").email("email").role(UserRole.Customer).build();
            doReturn(repoUser).when(userService).getUser();

            User updatedUser = User.builder()
                .name("updatedName")
                .email("email")
                .role(UserRole.Customer)
                .build();

            when(userRepository.findByEmail("email")).thenReturn(Optional.of(repoUser));
            when(userRepository.save(any(User.class))).thenReturn(repoUser);

            assertDoesNotThrow(() -> userService.updateUser(updatedUser));

            verify(userRepository).save(argThat(saved ->
                saved.getEmail().equals("email")
            ));
        }

        @Test
        @DisplayName("Email Already Taken")
        void updateUserEmailAlreadyTaken() {
            User repoUser = User.builder().name("name").email("email").role(UserRole.Customer).build();
            doReturn(repoUser).when(userService).getUser();

            User updatedUser = User.builder()
                .name("updatedName")
                .email("takenEmail")
                .role(UserRole.Customer)
                .build();

            User otherUser = User.builder().email("takenEmail").build();
            when(userRepository.findByEmail("takenEmail")).thenReturn(Optional.of(otherUser));

            assertThrows(UserAlreadyExistsException.class, () -> userService.updateUser(updatedUser));
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Set Seller Role")
        void updateUserRoleToSeller() {
            User repoUser = User.builder().name("name").email("email").role(UserRole.Customer).build();
            doReturn(repoUser).when(userService).getUser();

            User updatedUser = User.builder()
                .name("name")
                .email("email")
                .role(UserRole.Seller)
                .build();

            when(userRepository.findByEmail("email")).thenReturn(Optional.of(repoUser));
            when(userRepository.save(any(User.class))).thenReturn(repoUser);

            userService.updateUser(updatedUser);

            verify(userRepository).save(argThat(saved ->
                saved.getRole().equals(UserRole.Seller)
            ));
        }

        @Test
        @DisplayName("Set Customer Role")
        void updateUserRoleToCustomer() {
            User repoUser = User.builder().name("name").email("email").role(UserRole.Seller).build();
            doReturn(repoUser).when(userService).getUser();

            User updatedUser = User.builder()
                .name("name")
                .email("email")
                .role(UserRole.Admin)
                .build();

            when(userRepository.findByEmail("email")).thenReturn(Optional.of(repoUser));
            when(userRepository.save(any(User.class))).thenReturn(repoUser);

            userService.updateUser(updatedUser);

            verify(userRepository).save(argThat(saved ->
                saved.getRole().equals(UserRole.Customer)
            ));
        }
    }
}