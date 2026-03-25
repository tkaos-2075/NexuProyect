package com.nexu.Users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SigninRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String name;
}
