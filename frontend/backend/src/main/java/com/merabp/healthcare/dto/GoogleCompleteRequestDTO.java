package com.merabp.healthcare.dto;

import com.merabp.healthcare.model.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public class GoogleCompleteRequestDTO {

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Gender is required")
    private Gender gender;

    // Must be true — validated in service
    @NotNull(message = "Terms acceptance is required")
    private Boolean termsAccepted;

    public LocalDate getDateOfBirth()           { return dateOfBirth; }
    public Gender getGender()                   { return gender; }
    public Boolean getTermsAccepted()           { return termsAccepted; }

    public void setDateOfBirth(LocalDate dob)   { this.dateOfBirth = dob; }
    public void setGender(Gender gender)        { this.gender = gender; }
    public void setTermsAccepted(Boolean t)     { this.termsAccepted = t; }
}