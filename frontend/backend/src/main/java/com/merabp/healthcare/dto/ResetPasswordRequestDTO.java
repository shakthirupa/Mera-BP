package com.merabp.healthcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequestDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    // Hardcoded token for now — replace with UUID when JWT is implemented
    @NotBlank(message = "Reset token is required")
    private String resetToken;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$",
            message = "Password must contain at least one uppercase letter, one number, and one special character"
    )
    private String newPassword;

    public ResetPasswordRequestDTO() {}

    public String getEmail()                       { return email; }
    public void setEmail(String email)             { this.email = email; }

    public String getResetToken()                  { return resetToken; }
    public void setResetToken(String resetToken)   { this.resetToken = resetToken; }

    public String getNewPassword()                 { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}