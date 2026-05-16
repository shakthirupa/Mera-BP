package com.merabp.healthcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class StartEmailSignupRequestDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    public StartEmailSignupRequestDTO() {}

    public String getEmail()                   { return email; }
    public void setEmail(String email)         { this.email = email; }

}