package com.merabp.healthcare.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "medications",
        indexes = {
                @Index(
                        name = "idx_medication_patient_created",
                        columnList = "patient_id, created_at"
                )
        }
)
public class Medication extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 255)
    private String purpose;

    @Column(length = 500)
    private String instructions;

    // In Medication entity — add this relationship
    @OneToMany(mappedBy = "medication", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reminder> reminders = new ArrayList<>();
    protected Medication() {}

    public Medication(Patient patient, String name, String purpose, String instructions) {
        this.patient      = patient;
        this.name         = name;
        this.purpose      = purpose;
        this.instructions = instructions;
    }

    // Getters
    public Long getId()              { return id; }
    public Patient getPatient()      { return patient; }
    public String getName()          { return name; }
    public String getPurpose()       { return purpose; }
    public String getInstructions()  { return instructions; }

    // Setters — patient is immutable after creation
    public void setName(String name)                  { this.name = name; }
    public void setPurpose(String purpose)            { this.purpose = purpose; }
    public void setInstructions(String instructions)  { this.instructions = instructions; }
}