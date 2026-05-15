package com.merabp.healthcare.controller;

import com.merabp.healthcare.dto.ReminderRequestDTO;
import com.merabp.healthcare.dto.ReminderResponseDTO;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    // POST /medications/{medicationId}/reminders
    @PostMapping("/medications/{medicationId}/reminders")
    public ResponseEntity<ReminderResponseDTO> add(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long medicationId,
            @Valid @RequestBody ReminderRequestDTO request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reminderService.addReminder(patient.getId(), medicationId, request));
    }

    // GET /reminders
    // All reminders for a patient across all medications
    @GetMapping("/reminders")
    public ResponseEntity<List<ReminderResponseDTO>> getByPatient(
            @AuthenticationPrincipal Patient patient) {

        return ResponseEntity.ok(reminderService.getByPatient(patient.getId()));
    }

    // GET /medications/{medicationId}/reminders
    @GetMapping("/medications/{medicationId}/reminders")
    public ResponseEntity<List<ReminderResponseDTO>> getByMedication(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long medicationId) {

        return ResponseEntity.ok(reminderService.getByMedication(patient.getId(), medicationId));
    }

    // PUT /medications/{medicationId}/reminders/{reminderId}
    @PutMapping("/medications/{medicationId}/reminders/{reminderId}")
    public ResponseEntity<ReminderResponseDTO> update(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long medicationId,
            @PathVariable Long reminderId,
            @Valid @RequestBody ReminderRequestDTO request) {

        return ResponseEntity.ok(
                reminderService.updateReminder(patient.getId(), medicationId, reminderId, request));
    }

    // DELETE /medications/{medicationId}/reminders/{reminderId}
    @DeleteMapping("/medications/{medicationId}/reminders/{reminderId}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Patient patient,
            @PathVariable Long medicationId,
            @PathVariable Long reminderId) {

        reminderService.deleteReminder(patient.getId(), medicationId, reminderId);
        return ResponseEntity.noContent().build();
    }
}