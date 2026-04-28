package com.abdullah.eCommerce.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponseErrorDto {
    private String errorMessage;
    private Integer errorCode;
    private String status;
}
