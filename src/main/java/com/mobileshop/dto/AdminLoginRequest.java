package com.mobileshop.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AdminLoginRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
