package com.abdullah.eCommerce.security;


import com.abdullah.eCommerce.entities.User;
import com.abdullah.eCommerce.services.AuthenticationService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {
    private final AuthenticationService authenticationService;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String token = extractToken(request);
            if (token != null) {
                UserDetails userDetails = authenticationService.validateToken(token);

                if (!userDetails.isAccountNonLocked()) throw new LockedException("Account is locked");

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
                if (userDetails instanceof UserPrincipal) {
                    User user = ((UserPrincipal) userDetails).getUser();
                    request.setAttribute("userId", user.getId());
                    request.setAttribute("user", user);
                }
            }
        } catch (Exception e) {
            log.warn("An unauthenticated user");
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        return authHeader != null && authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : null;
    }
}
