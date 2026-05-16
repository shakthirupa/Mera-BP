package com.merabp.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(
        name = "reminders",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_medication_reminder_time",
                        columnNames = {"medication_id", "reminder_time"}
                )
        },
        indexes = {
                @Index(
                        name = "idx_reminder_medication_time",
                        columnList = "medication_id, reminder_time"
                )
        }
)
public class Reminder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @Column(name = "reminder_time", nullable = false)
    private LocalTime reminderTime;

    protected Reminder() {}

    public Reminder(Medication medication, LocalTime reminderTime) {
        this.medication   = medication;
        this.reminderTime = reminderTime;
    }

    // Getters
    public Long getId()                  { return id; }
    public Medication getMedication()    { return medication; }
    public LocalTime getReminderTime()   { return reminderTime; }

    // medication is immutable after creation — only reminderTime can change
    public void setReminderTime(LocalTime reminderTime) { this.reminderTime = reminderTime; }
}