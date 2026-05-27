package com.merabp.healthcare.service;

import com.merabp.healthcare.dto.PatientResponseDTO;
import com.merabp.healthcare.dto.PatientUpdateRequestDTO;
import com.merabp.healthcare.exception.BusinessRuleException;
import com.merabp.healthcare.exception.ResourceNotFoundException;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.repository.MedicationRepository;
import com.merabp.healthcare.repository.ObservationRepository;
import com.merabp.healthcare.repository.OtpVerificationRepository;
import com.merabp.healthcare.repository.PatientRepository;
import com.merabp.healthcare.repository.RefreshTokenRepository;
import com.merabp.healthcare.repository.ReminderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {

    private final PatientRepository       patientRepo;
    private final ObservationRepository    observationRepo;
    private final MedicationRepository     medicationRepo;
    private final ReminderRepository       reminderRepo;
    private final RefreshTokenRepository   refreshTokenRepo;
    private final OtpVerificationRepository otpRepo;

    public PatientService(PatientRepository patientRepo,
                          ObservationRepository observationRepo,
                          MedicationRepository medicationRepo,
                          ReminderRepository reminderRepo,
                          RefreshTokenRepository refreshTokenRepo,
                          OtpVerificationRepository otpRepo) {
        this.patientRepo      = patientRepo;
        this.observationRepo  = observationRepo;
        this.medicationRepo   = medicationRepo;
        this.reminderRepo     = reminderRepo;
        this.refreshTokenRepo = refreshTokenRepo;
        this.otpRepo          = otpRepo;
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<PatientResponseDTO> getAllPatients(Pageable pageable) {
        // Only return verified patients — unverified are incomplete registrations
        return patientRepo.findAllByDeletedFalse(pageable)
                .map(PatientResponseDTO::from);
    }

    @Transactional(readOnly = true)
    public PatientResponseDTO getById(Long id) {
        return patientRepo.findByIdAndDeletedFalse(id)
                .map(PatientResponseDTO::from)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public PatientResponseDTO getByEmail(String email) {
        return patientRepo.findByEmailAndDeletedFalse(email)
                .map(PatientResponseDTO::from)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with email: " + email));
    }

    @Transactional(readOnly = true)
    public PatientResponseDTO getByPhone(String phone) {
        return patientRepo.findByPhoneAndDeletedFalse(phone)
                .map(PatientResponseDTO::from)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with phone: " + phone));
    }

    // ── Update ────────────────────────────────────────────────────────────────
    // Email and phone are intentionally excluded — they are auth credentials.
    // Changing them requires a separate verified flow (OTP confirmation on new email).

    @Transactional
    public PatientResponseDTO updatePatient(Long id, PatientUpdateRequestDTO request) {

        Patient patient = patientRepo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + id));

        patient.setName(request.getName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());

        return PatientResponseDTO.from(patient);
    }

    // ── Delete (hard delete all data, soft delete patient row) ───────────────

    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + id));

        // 1. Delete all refresh tokens
        refreshTokenRepo.deleteAllByPatientId(id);

        // 2. Delete all observations (BP, heart rate, glucose, HbA1c)
        observationRepo.deleteAllByPatientId(id);

        // 3. Delete all reminders + medications (reminders cascade from medications)
        reminderRepo.deleteAllByPatientId(id);
        medicationRepo.deleteAllByPatientId(id);

        // 4. Delete OTPs linked to this patient's email/phone
        if (patient.getEmail() != null) {
            otpRepo.deleteAllByEmail(patient.getEmail());
        }
        if (patient.getPhone() != null) {
            otpRepo.deleteAllByEmail(patient.getPhone());
        }

        // 5. Soft delete patient row + nullify unique fields so same email/phone can re-register
        patient.setDeleted(true);
        patient.setEmail(null);
        patient.setPhone(null);
        patient.setGoogleId(null);
    }
}