package com.merabp.healthcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EmailLoginRequestDTO {

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    public EmailLoginRequestDTO() {}

    public String getEmail()                   { return email; }
    public void setEmail(String email)         { this.email = email; }

    public String getPhone()                   { return phone; }
    public void setPhone(String phone)         { this.phone = phone; }

    public String getPassword()                { return password; }
    public void setPassword(String password)   { this.password = password; }
}