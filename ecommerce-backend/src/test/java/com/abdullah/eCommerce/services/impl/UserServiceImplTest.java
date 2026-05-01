package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.exceptions.UserAlreadyExistsException;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.security.UserPrincipal;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContextHolder securityContextHolder;

    @InjectMocks
    @Spy
    private UserServiceImpl userService;

    @Nested
    @DisplayName("getUser()")
    class GetUser {
        private MockedStatic<SecurityContextHolder> securityContextMock;

        @BeforeEach
        void setUp() {
            SecurityContext securityContext = Mockito.mock(SecurityContext.class);
            Authentication authentication = Mockito.mock(Authentication.class);

            securityContextMock = Mockito.mockStatic(SecurityContextHolder.class);
            securityContextMock.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn("email");
        }

        @AfterEach
        void tearDown() {
            securityContextMock.close();
        }

        @Test
        @DisplayName("Get user by email from security context")
        void shouldReturnUserWhenEmailExists() {
            when(userRepository.findByEmail("email"))
                    .thenReturn(Optional.of(User.builder().email("email").build()));

            assertDoesNotThrow(() -> userService.getUser());

            User user = userService.getUser();
            assertNotNull(user);
            assertEquals("email", user.getEmail());
        }

        @Test
        @DisplayName("Throw when user doesn't exist")
        void throwWhenUserDoesntExist() {
            when(userRepository.findByEmail("email"))
                    .thenReturn(Optional.empty());

            assertThrows(UsernameNotFoundException.class, () -> userService.getUser());
        }
    }

    @Nested
    @DisplayName("updateUser()")
    class UpdateUser {
        @Test
        @DisplayName("Update user")
        void updateUser() {
            User repoUser = User.builder().name("name").email("email").isSeller(true).build();
            doReturn(repoUser).when(userService).getUser();

            User updatedUser = User.builder()
                    .name("updatedName")
                    .email("updatedEmail")
                    .isSeller(false)
                    .build();

            // new email is not taken by anyone
            when(userRepository.findByEmail(updatedUser.getEmail()))
                    .thenReturn(Optional.empty());

            assertDoesNotThrow(() -> userService.updateUser(updatedUser));

            verify(userRepository).save(argThat(saved ->
                    saved.getName().equals(updatedUser.getName()) &&
                            saved.getEmail().equals(updatedUser.getEmail()) &&
                            saved.getIsSeller().equals(updatedUser.getIsSeller())
            ));
        }

        @Test
        @DisplayName("Update user without changing email")
        void updateUserWithSameEMail() {
            User repoUser = User.builder().name("name").email("email").isSeller(true).build();
            doReturn(repoUser).when(userService).getUser();

            User updatedUser = User.builder()
                    .name("updatedName")
                    .email("email")
                    .isSeller(false)
                    .build();

            when(userRepository.findByEmail(repoUser.getEmail()))
                    .thenReturn(Optional.of(repoUser));

            assertDoesNotThrow(() -> userService.updateUser(updatedUser));

            verify(userRepository).save(argThat(saved ->
                    saved.getEmail().equals(updatedUser.getEmail())
            ));
        }

        @Test
        @DisplayName("Throw when new email is already taken")
        void throwWhenEmailAlreadyTaken() {
            User repoUser = User.builder().name("name").email("email").isSeller(true).build();
            doReturn(repoUser).when(userService).getUser();

            User updatedUser = User.builder()
                    .name("updatedName")
                    .email("takenEmail")
                    .isSeller(false)
                    .build();

            User otherUser = User.builder().email("takenEmail").build();

            // new email is already taken by someone else
            when(userRepository.findByEmail(updatedUser.getEmail()))
                    .thenReturn(Optional.of(otherUser));

            assertThrows(UserAlreadyExistsException.class, () -> userService.updateUser(updatedUser));
        }
    }

    @Test
    void isSeller() {
        UserDetails sellerUser = new UserPrincipal(User.builder().isSeller(true).build());
        assertTrue(userService.isSeller(sellerUser));

        UserDetails nonSellerUser = new UserPrincipal(User.builder().isSeller(false).build());
        assertFalse(userService.isSeller(nonSellerUser));
    }
}