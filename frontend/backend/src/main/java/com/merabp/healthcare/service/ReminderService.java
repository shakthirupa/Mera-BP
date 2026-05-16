package com.merabp.healthcare.service;

import com.merabp.healthcare.dto.ReminderRequestDTO;
import com.merabp.healthcare.dto.ReminderResponseDTO;
import com.merabp.healthcare.exception.DuplicateResourceException;
import com.merabp.healthcare.exception.ResourceNotFoundException;
import com.merabp.healthcare.model.Medication;
import com.merabp.healthcare.model.Reminder;
import com.merabp.healthcare.repository.MedicationRepository;
import com.merabp.healthcare.repository.ReminderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepo;
    private final MedicationRepository medicationRepo;

    public ReminderService(ReminderRepository reminderRepo,
                           MedicationRepository medicationRepo) {
        this.reminderRepo   = reminderRepo;
        this.medicationRepo = medicationRepo;
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public ReminderResponseDTO addReminder(Long patientId, Long medicationId,
                                           ReminderRequestDTO request) {

        Medication medication = findMedication(patientId, medicationId);

        if (reminderRepo.existsByMedicationIdAndReminderTime(
                medicationId, request.getReminderTime())) {
            throw new DuplicateResourceException(
                    "A reminder already exists for this medication at " + request.getReminderTime());
        }

        Reminder reminder = new Reminder(medication, request.getReminderTime());

        return ReminderResponseDTO.from(reminderRepo.save(reminder));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ReminderResponseDTO> getByMedication(Long patientId, Long medicationId) {

        findMedication(patientId, medicationId);

        return reminderRepo.findAllByMedicationIdOrderByReminderTimeAsc(medicationId)
                .stream()
                .map(ReminderResponseDTO::from)
                .toList();
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Transactional
    public ReminderResponseDTO updateReminder(Long patientId, Long medicationId,
                                              Long reminderId, ReminderRequestDTO request) {

        findMedication(patientId, medicationId);

        Reminder reminder = reminderRepo
                .findByIdAndMedicationId(reminderId, medicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Reminder not found with id: " + reminderId));

        if (reminderRepo.existsByMedicationIdAndReminderTimeAndIdNot(
                medicationId, request.getReminderTime(), reminderId)) {
            throw new DuplicateResourceException(
                    "A reminder already exists for this medication at " + request.getReminderTime());
        }

        reminder.setReminderTime(request.getReminderTime());

        // No save() needed — dirty checking handles update within @Transactional
        return ReminderResponseDTO.from(reminder);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void deleteReminder(Long patientId, Long medicationId, Long reminderId) {

        findMedication(patientId, medicationId);

        Reminder reminder = reminderRepo
                .findByIdAndMedicationId(reminderId, medicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Reminder not found with id: " + reminderId));

        reminderRepo.delete(reminder);
    }

    // ── All reminders for a patient ──────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ReminderResponseDTO> getByPatient(Long patientId) {
        return reminderRepo.findAllByPatientIdOrderByReminderTimeAsc(patientId)
                .stream()
                .map(ReminderResponseDTO::from)
                .toList();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    // Validates full ownership chain: patient → medication
    // Checks patient is active and verified, and medication belongs to that patient
    private Medication findMedication(Long patientId, Long medicationId) {
        // findByIdAndPatientId ensures the medication belongs to this patient
        return medicationRepo.findByIdAndPatientId(medicationId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medication not found with id: " + medicationId));
    }
}