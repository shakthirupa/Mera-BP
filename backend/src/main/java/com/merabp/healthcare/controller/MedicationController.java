package com.merabp.healthcare.controller;

import com.merabp.healthcare.dto.MedicationRequestDTO;
import com.merabp.healthcare.dto.MedicationResponseDTO;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    // POST /medications
    @PostMapping
    public ResponseEntity<MedicationResponseDTO> add(
            @AuthenticationPrincipal Patient patient,
            @Valid @RequestBody MedicationRequestDTO request) {

        System.out.println(patient);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(medicationService.addMedication(patient, request));
    }

    // GET /medications
    @GetMapping
    public ResponseEntity<List<MedicationResponseDTO>> getByPatient(
            @AuthenticationPrincipal Patient patient) {

        return ResponseEntity.ok(medicationService.getByPatient(patient.getId()));
    }

    // PUT /medications/{medicationId}
    @PutMapping("/{medicationId}")
    public ResponseEntity<MedicationResponseDTO> update(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long medicationId,
            @Valid @RequestBody MedicationRequestDTO request) {

        return ResponseEntity.ok(
                medicationService.updateMedication(patient.getId(), medicationId, request));
    }

    // DELETE /medications/{medicationId}
    @DeleteMapping("/{medicationId}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long medicationId) {

        medicationService.deleteMedication(patient.getId(), medicationId);
        return ResponseEntity.noContent().build();
    }
}