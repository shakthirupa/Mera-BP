package com.merabp.healthcare.dto;

import com.merabp.healthcare.model.GlucoseContext;
import com.merabp.healthcare.model.ObservationCode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

// Cross-field validation (requiresValue2, requiresContext) is handled
// in ObservationService using ObservationCode metadata — not here,
// because Bean Validation cannot reference enum methods cleanly.

public class ObservationRequestDTO {

    @NotNull(message = "Observation code is required")
    private ObservationCode code;

    @NotNull(message = "value1 is required")
    private Double value1;

    // Required only for BLOOD_PRESSURE — validated in service
    private Double value2;

    // Required only for BLOOD_GLUCOSE — validated in service
    private GlucoseContext context;

    @NotNull(message = "Effective date-time is required")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime effectiveDateTime;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;

    public ObservationRequestDTO() {}


    public ObservationCode getCode()            { return code; }
    public void setCode(ObservationCode code)   { this.code = code; }

    public Double getValue1()                   { return value1; }
    public void setValue1(Double value1)        { this.value1 = value1; }

    public Double getValue2()                   { return value2; }
    public void setValue2(Double value2)        { this.value2 = value2; }

    public GlucoseContext getContext()          { return context; }
    public void setContext(GlucoseContext ctx)  { this.context = ctx; }

    public LocalDateTime getEffectiveDateTime()             { return effectiveDateTime; }
    public void setEffectiveDateTime(LocalDateTime dt)      { this.effectiveDateTime = dt; }

    public String getNotes()                    { return notes; }
    public void setNotes(String notes)          { this.notes = notes; }
}