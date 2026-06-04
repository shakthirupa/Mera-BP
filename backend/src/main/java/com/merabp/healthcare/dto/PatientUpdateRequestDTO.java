package com.merabp.healthcare.dto;

import com.merabp.healthcare.model.Gender;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class PatientUpdateRequestDTO {
        @NotNull(message = "Date of birth is required")
        @PastOrPresent(message = "Date of birth must not be in future")
        private LocalDate dateOfBirth;

        @NotNull(message = "Gender is required")
        private Gender gender;

        public PatientUpdateRequestDTO() {}

        public PatientUpdateRequestDTO(LocalDate dateOfBirth, Gender gender) {
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
        }

        // Getters & Setters

        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

        public Gender getGender() { return gender; }
        public void setGender(Gender gender) { this.gender = gender; }

}
