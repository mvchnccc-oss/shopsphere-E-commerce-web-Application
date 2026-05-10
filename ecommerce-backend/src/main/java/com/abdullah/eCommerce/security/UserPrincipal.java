package com.abdullah.eCommerce.security;

import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.entities.UserRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class UserPrincipal implements UserDetails {
    @Getter
    private final User user;

    public Long getId() {
        return user.getId();
    }

    public UserRole getRole() {
        return user.getRole();
    }

    @Override
    public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {
        String role = user.getRole().toString();
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public @NonNull String getUsername() {
        return user.getEmail();
    }

    @Override
    public @Nullable String getPassword() {
        return user.getPassword();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.isLocked();
    }
}
