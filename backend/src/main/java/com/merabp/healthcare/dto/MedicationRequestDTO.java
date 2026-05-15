package com.merabp.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MedicationRequestDTO {

    @NotBlank(message = "Medication name is required")
    @Size(max = 150, message = "Medication name must not exceed 150 characters")
    private String name;

    @Size(max = 255, message = "Purpose must not exceed 255 characters")
    private String purpose;

    @Size(max = 500, message = "Instructions must not exceed 500 characters")
    private String instructions;

    public MedicationRequestDTO() {}

    public String getName()                          { return name; }
    public void setName(String name)                 { this.name = name; }

    public String getPurpose()                       { return purpose; }
    public void setPurpose(String purpose)           { this.purpose = purpose; }

    public String getInstructions()                  { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
}