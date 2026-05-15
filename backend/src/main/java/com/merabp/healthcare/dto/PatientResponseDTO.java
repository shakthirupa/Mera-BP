package com.merabp.healthcare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.merabp.healthcare.model.AuthProvider;
import com.merabp.healthcare.model.Gender;
import com.merabp.healthcare.model.Patient;

import java.time.LocalDate;


public class PatientResponseDTO {

    private String name;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    private Gender gender;
    private String email;
    private String phone;
    private AuthProvider authProvider;

    private PatientResponseDTO() {}

    // Static factory — keeps construction logic in one place
    public static PatientResponseDTO from(Patient patient) {
        PatientResponseDTO dto = new PatientResponseDTO();
        dto.name        = patient.getName();
        dto.dateOfBirth = patient.getDateOfBirth();
        dto.gender      = patient.getGender();
        dto.email       = patient.getEmail();
        dto.phone       = patient.getPhone();
        dto.authProvider = patient.getAuthProvider();
        return dto;
    }

    // Getters (no setters — response is read-only)

    public String getName() { return name; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public Gender getGender() { return gender; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public AuthProvider getAuthProvider() {return authProvider;}

}