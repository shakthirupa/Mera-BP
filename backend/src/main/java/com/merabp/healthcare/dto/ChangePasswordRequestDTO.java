package com.merabp.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequestDTO {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$",
        message = "Password must contain at least one uppercase letter, one number, and one special character"
    )
    private String newPassword;

    public ChangePasswordRequestDTO() {}

    public String getCurrentPassword()                     { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

    public String getNewPassword()                         { return newPassword; }
    public void setNewPassword(String newPassword)         { this.newPassword = newPassword; }
}
