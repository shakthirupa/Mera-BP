package com.merabp.healthcare.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public class ReminderRequestDTO {

    @NotNull(message = "Reminder time is required")
    private LocalTime reminderTime;

    public ReminderRequestDTO() {}

    public LocalTime getReminderTime()                   { return reminderTime; }
    public void setReminderTime(LocalTime reminderTime)  { this.reminderTime = reminderTime; }
}