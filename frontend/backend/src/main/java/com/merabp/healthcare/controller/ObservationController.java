package com.merabp.healthcare.controller;

import com.merabp.healthcare.dto.ObservationRequestDTO;
import com.merabp.healthcare.dto.ObservationResponseDTO;
import com.merabp.healthcare.model.GlucoseContext;
import com.merabp.healthcare.model.ObservationCode;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.service.ObservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/observations")
public class ObservationController {

    private final ObservationService observationService;

    public ObservationController(ObservationService observationService) {
        this.observationService = observationService;
    }

    // POST /observations

    @PostMapping
    public ResponseEntity<ObservationResponseDTO> createObservation(
            @AuthenticationPrincipal Patient patient,
            @Valid @RequestBody ObservationRequestDTO request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(observationService.addObservation(patient, request));
    }

    // GET /observations?code=...&context=...

    @GetMapping
    public ResponseEntity<List<ObservationResponseDTO>> getObservations(
            @AuthenticationPrincipal Patient patient,
            @RequestParam(required = false) ObservationCode code,
            @RequestParam(required = false) GlucoseContext context) {

        return ResponseEntity.ok(
                observationService.getObservationsForPatient(patient.getId(), code, context));
    }

    // GET /observations/{observationId}

    @GetMapping("/{observationId}")
    public ResponseEntity<ObservationResponseDTO> getObservation(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long observationId) {

        return ResponseEntity.ok(observationService.getObservation(patient.getId(), observationId));
    }

    // PUT /observations/{observationId}

    @PutMapping("/{observationId}")
    public ResponseEntity<ObservationResponseDTO> updateObservation(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long observationId,
            @Valid @RequestBody ObservationRequestDTO request) {

        return ResponseEntity.ok(
                observationService.updateObservation(patient.getId(), observationId, request));
    }

    // DELETE /observations/{observationId}

    @DeleteMapping("/{observationId}")
    public ResponseEntity<Void> deleteObservation(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long observationId) {

        observationService.deleteObservation(patient.getId(), observationId);
        return ResponseEntity.noContent().build(); // 204
    }
}