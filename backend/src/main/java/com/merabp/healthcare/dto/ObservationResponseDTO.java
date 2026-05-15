package com.merabp.healthcare.dto;

import com.merabp.healthcare.model.GlucoseContext;
import com.merabp.healthcare.model.Observation;
import com.merabp.healthcare.model.ObservationCode;

import java.time.LocalDateTime;

public class ObservationResponseDTO {

    private Long id;
    private Long patientId;

    private ObservationCode code;

    private Double value1;
    private String unit1;           // from ObservationCode metadata

    private Double value2;          // null unless BLOOD_PRESSURE
    private String unit2;           // null unless BLOOD_PRESSURE

    private GlucoseContext context; // null unless BLOOD_GLUCOSE

    // Human-readable display (e.g. "120/80 mmHg", "72 bpm")
    private String display;

    private LocalDateTime effectiveDateTime;
    private String notes;


    private ObservationResponseDTO() {}

    public static ObservationResponseDTO from(Observation obs) {
        ObservationResponseDTO dto = new ObservationResponseDTO();
        ObservationCode code = obs.getCode();

        dto.id              = obs.getId();
        dto.patientId       = obs.getPatient().getId();
        dto.code            = code;
        dto.value1          = obs.getValue1();
        dto.unit1           = code.getUnit1();
        dto.value2          = obs.getValue2();
        dto.unit2           = code.getUnit2();
        dto.context         = obs.getContext();
        dto.display         = buildDisplay(obs);
        dto.effectiveDateTime = obs.getEffectiveDateTime();
        dto.notes           = obs.getNotes();

        return dto;
    }

    private static String buildDisplay(Observation obs) {
        ObservationCode code = obs.getCode();
        if (code.requiresValue2() && obs.getValue2() != null) {
            // e.g. "120/80 mmHg"
            return String.format("%.0f/%.0f %s", obs.getValue1(), obs.getValue2(), code.getUnit1());
        }
        // e.g. "72 bpm", "5.4 %", "95 mg/dL"
        return String.format("%.1f %s", obs.getValue1(), code.getUnit1());
    }

    // ── Getters (no setters — response is read-only) ──────────────────────────

    public Long getId()                         { return id; }
    public Long getPatientId()                  { return patientId; }
    public ObservationCode getCode()            { return code; }
    public Double getValue1()                   { return value1; }
    public String getUnit1()                    { return unit1; }
    public Double getValue2()                   { return value2; }
    public String getUnit2()                    { return unit2; }
    public GlucoseContext getContext()          { return context; }
    public String getDisplay()                  { return display; }
    public LocalDateTime getEffectiveDateTime() { return effectiveDateTime; }
    public String getNotes()                    { return notes; }

}