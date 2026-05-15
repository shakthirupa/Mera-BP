package com.merabp.healthcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "observations",
        indexes = {
                @Index(
                        name = "idx_observation_patient_code_context_date",
                        columnList = "patient_id, code, context, effective_date_time"
                )
        }
)
public class Observation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ObservationCode code;

    // value1 — primary reading (heart rate, systolic BP, glucose, HbA1c)
    @Column(nullable = false)
    private Double value1;

    // value2 — only for BLOOD_PRESSURE (diastolic). Null for all other codes.
    @Column
    private Double value2;

    // Only populated when code = BLOOD_GLUCOSE
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private GlucoseContext context;

    @Column(name = "effective_date_time", nullable = false)
    private LocalDateTime effectiveDateTime;

    @Column(length = 500)
    private String notes;

    protected Observation() {}

    public Observation(Patient patient, ObservationCode code,
                       Double value1, Double value2,
                       GlucoseContext context,
                       LocalDateTime effectiveDateTime,
                       String notes) {
        this.patient           = patient;
        this.code              = code;
        this.value1            = value1;
        this.value2            = value2;
        this.context           = context;
        this.effectiveDateTime = effectiveDateTime;
        this.notes             = notes;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public Long getId()                        { return id; }
    public Patient getPatient()                { return patient; }
    public ObservationCode getCode()           { return code; }
    public Double getValue1()                  { return value1; }
    public Double getValue2()                  { return value2; }
    public GlucoseContext getContext()         { return context; }
    public LocalDateTime getEffectiveDateTime(){ return effectiveDateTime; }
    public String getNotes()                   { return notes; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setPatient(Patient patient)                    { this.patient = patient; }
    public void setCode(ObservationCode code)                  { this.code = code; }
    public void setValue1(Double value1)                       { this.value1 = value1; }
    public void setValue2(Double value2)                       { this.value2 = value2; }
    public void setContext(GlucoseContext context)             { this.context = context; }
    public void setEffectiveDateTime(LocalDateTime dt)         { this.effectiveDateTime = dt; }
    public void setNotes(String notes)                         { this.notes = notes; }
}