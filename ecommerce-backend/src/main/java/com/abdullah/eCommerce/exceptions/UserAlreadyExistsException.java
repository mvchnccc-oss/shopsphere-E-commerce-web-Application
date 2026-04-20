package com.abdullah.eCommerce.exceptions;

public class UserAlreadyExistsException extends RuntimeException {
    private final String email;
    public UserAlreadyExistsException(String email) {
        super("User already exist with email :" + email);
        this.email = email;
    }
}
