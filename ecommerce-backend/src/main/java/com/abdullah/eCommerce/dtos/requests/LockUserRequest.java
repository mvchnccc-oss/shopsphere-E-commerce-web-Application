package com.abdullah.eCommerce.dtos.requests;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LockUserRequest {
    @NotNull
    private Long userId;

    @NotNull
    private Boolean lock;
}
