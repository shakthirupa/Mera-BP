package com.merabp.healthcare.dto;

import com.merabp.healthcare.model.Gender;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class EmailSignupRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Date of birth is required")
    @PastOrPresent(message = "Date of birth must not be in the future")
    private LocalDate dateOfBirth;

    @NotNull(message = "Gender is required")
    private Gender gender;

    // Min 8 chars, at least one uppercase, one digit, one special character
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$",
            message = "Password must contain at least one uppercase letter, one number, and one special character"
    )
    private String password;

    @AssertTrue(message = "You must accept the terms and conditions")
    private boolean termsAccepted;

    public EmailSignupRequestDTO() {}

    // Getters & Setters
    public String getName()                                    { return name; }
    public void setName(String name)                           { this.name = name; }

    public LocalDate getDateOfBirth()                          { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth)          { this.dateOfBirth = dateOfBirth; }

    public Gender getGender()                                  { return gender; }
    public void setGender(Gender gender)                       { this.gender = gender; }

    public String getPassword()                                { return password; }
    public void setPassword(String password)                   { this.password = password; }

    public boolean isTermsAccepted()                           { return termsAccepted; }
    public void setTermsAccepted(boolean termsAccepted)        { this.termsAccepted = termsAccepted; }
}