package com.merabp.healthcare.dto;

import com.merabp.healthcare.model.Reminder;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class ReminderResponseDTO {

    private Long id;
    private Long medicationId;
    private String medicationName;
    private LocalTime reminderTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private ReminderResponseDTO() {}

    public static ReminderResponseDTO from(Reminder reminder) {
        ReminderResponseDTO dto = new ReminderResponseDTO();
        dto.id             = reminder.getId();
        dto.medicationId   = reminder.getMedication().getId();
        dto.medicationName = reminder.getMedication().getName();
        dto.reminderTime   = reminder.getReminderTime();
        dto.createdAt      = reminder.getCreatedAt();
        dto.updatedAt      = reminder.getUpdatedAt();
        return dto;
    }

    // Getters — no setters, response is read-only
    public Long getId()                  { return id; }
    public Long getMedicationId()        { return medicationId; }
    public String getMedicationName()    { return medicationName; }
    public LocalTime getReminderTime()   { return reminderTime; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
}