package com.abdullah.eCommerce.services.impl;

import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.exceptions.UserAlreadyExistsException;
import com.abdullah.eCommerce.repositories.UserRepository;
import com.abdullah.eCommerce.services.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User getUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException(email)
        );
    }

    @Transactional
    @Override
    public User updateUser(User updatedUser) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("User Doesn't exist with id " + email)
        );
        Optional<User> existingUser = userRepository.findByEmail(updatedUser.getEmail());
        if (existingUser.isPresent() && !email.equals(existingUser.get().getEmail())) {
            throw new UserAlreadyExistsException(existingUser.get().getEmail());
        }

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        return userRepository.save(user);
    }

    @Override
    public boolean isSeller(UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority()
                        .equals("ROLE_SELLER"));
    }


}
