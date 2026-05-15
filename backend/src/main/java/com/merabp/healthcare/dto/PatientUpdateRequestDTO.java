package com.merabp.healthcare.dto;

import com.merabp.healthcare.model.Gender;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class PatientUpdateRequestDTO {
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        private String name;

        @NotNull(message = "Date of birth is required")
        @PastOrPresent(message = "Date of birth must not be in future")
        private LocalDate dateOfBirth;

        @NotNull(message = "Gender is required")
        private Gender gender;

        public PatientUpdateRequestDTO() {}

        public PatientUpdateRequestDTO(String name, LocalDate dateOfBirth, Gender gender,
                                 String email, String phone) {
            this.name = name;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
        }

        // Getters & Setters

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

        public Gender getGender() { return gender; }
        public void setGender(Gender gender) { this.gender = gender; }

}
