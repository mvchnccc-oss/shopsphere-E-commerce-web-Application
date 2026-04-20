package com.abdullah.eCommerce.controllers;

import com.abdullah.eCommerce.domain.dtos.ApiResponseErrorDto;
import com.abdullah.eCommerce.exceptions.CartNotFoundException;
import com.abdullah.eCommerce.exceptions.CategoryNotFoundException;
import com.abdullah.eCommerce.exceptions.ProductNotFoundException;
import com.abdullah.eCommerce.exceptions.UserAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {



    @ExceptionHandler(CartNotFoundException.class)
    public ResponseEntity<ApiResponseErrorDto> handelCartNotFoundException(
            CartNotFoundException ex
    ){
        HttpStatus code = HttpStatus.NOT_FOUND;
        log.warn(ex.getMessage());
        return new ResponseEntity<>(
                ApiResponseErrorDto.builder()
                        .errorCode(code.value())
                        .errorMessage(ex.getMessage())
                        .status(code.getReasonPhrase())
                        .build(),
                code
        );
    }


    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponseErrorDto> handleUsernameNotFoundException(
            UsernameNotFoundException ex
    ){
        HttpStatus code = HttpStatus.UNAUTHORIZED;
        log.warn(ex.getMessage());
        return new ResponseEntity<>(
                ApiResponseErrorDto.builder()
                        .errorCode(code.value())
                        .errorMessage(ex.getMessage())
                        .status(code.getReasonPhrase())
                        .build(),
                code
        );
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseErrorDto> handelMethodArgumentNotValidException(
            MethodArgumentNotValidException ex
    ){
        HttpStatus code = HttpStatus.BAD_REQUEST;
        log.warn(ex.getMessage());
        String errorMessage = ex.getBindingResult().getFieldErrors().stream().findFirst().map(DefaultMessageSourceResolvable::getDefaultMessage).orElse("Invalid Requset Body");
        return new ResponseEntity<>(
                ApiResponseErrorDto.builder()
                        .errorCode(code.value())
                        .errorMessage(errorMessage)
                        .status(code.getReasonPhrase())
                        .build(),
                code
        );
    }
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponseErrorDto> handleUserAlreadyExistException(
            UserAlreadyExistsException ex
    ){
        HttpStatus code = HttpStatus.CONFLICT;
        log.warn(ex.getMessage());
        return new ResponseEntity<>(
                ApiResponseErrorDto.builder()
                        .errorCode(code.value())
                        .errorMessage(ex.getMessage())
                        .status(code.getReasonPhrase())
                        .build(),
                code
        );
    }


    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiResponseErrorDto> handleCategoryNotFoundException(
            CategoryNotFoundException ex
    ){
        HttpStatus code = HttpStatus.NOT_FOUND;
        log.warn(ex.getMessage());
        return new ResponseEntity<>(
                ApiResponseErrorDto.builder()
                        .errorCode(code.value())
                        .errorMessage(ex.getMessage())
                        .status(code.getReasonPhrase())
                        .build(),
                code
        );
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiResponseErrorDto> handleProductNotFoundException(
            ProductNotFoundException ex
    ){
        HttpStatus code = HttpStatus.NOT_FOUND;
        log.error(ex.getMessage());
        return new ResponseEntity<>(
                ApiResponseErrorDto.builder()
                        .errorCode(code.value())
                        .errorMessage("An unexpected error occurred")
                        .status(code.getReasonPhrase())
                        .build(),
                code
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponseErrorDto> handelBadExceptionExceptions (
            BadCredentialsException ex
    ){
        HttpStatus code = HttpStatus.UNAUTHORIZED;
        log.warn(ex.getMessage());
        return new ResponseEntity<>(
                ApiResponseErrorDto.builder()
                        .errorCode(code.value())
                        .errorMessage("Invalid email or password")
                        .status(code.getReasonPhrase())
                        .build(),
                code
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseErrorDto> handelExceptions (
            Exception ex
    ){
        HttpStatus code = HttpStatus.INTERNAL_SERVER_ERROR;
        log.warn(ex.toString());
        return new ResponseEntity<>(
                ApiResponseErrorDto.builder()
                        .errorCode(code.value())
                        .errorMessage(ex.getMessage())
                        .status(code.getReasonPhrase())
                        .build(),
                code
        );
    }
}
