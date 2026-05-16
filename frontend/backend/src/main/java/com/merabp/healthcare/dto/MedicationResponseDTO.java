package com.merabp.healthcare.dto;

import com.merabp.healthcare.model.Medication;

import java.time.LocalDateTime;

public class MedicationResponseDTO {

    private Long id;
    private Long patientId;
    private String name;
    private String purpose;
    private String instructions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private MedicationResponseDTO() {}

    public static MedicationResponseDTO from(Medication medication) {
        MedicationResponseDTO dto = new MedicationResponseDTO();
        dto.id           = medication.getId();
        dto.patientId    = medication.getPatient().getId();
        dto.name         = medication.getName();
        dto.purpose      = medication.getPurpose();
        dto.instructions = medication.getInstructions();
        dto.createdAt    = medication.getCreatedAt();
        dto.updatedAt    = medication.getUpdatedAt();
        return dto;
    }

    // Getters — no setters, response is read-only
    public Long getId()                  { return id; }
    public Long getPatientId()           { return patientId; }
    public String getName()              { return name; }
    public String getPurpose()           { return purpose; }
    public String getInstructions()      { return instructions; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
}