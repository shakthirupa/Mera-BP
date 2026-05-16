package com.merabp.healthcare.service;

import com.merabp.healthcare.dto.PatientResponseDTO;
import com.merabp.healthcare.dto.PatientUpdateRequestDTO;
import com.merabp.healthcare.exception.BusinessRuleException;
import com.merabp.healthcare.exception.ResourceNotFoundException;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.repository.PatientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {

    private final PatientRepository patientRepo;

    public PatientService(PatientRepository patientRepo) {
        this.patientRepo = patientRepo;
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

    // ── Soft Delete ───────────────────────────────────────────────────────────

    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + id));
        patient.setDeleted(true);
        // Nullify unique fields so the same email/phone/googleId can be re-registered
        patient.setEmail(null);
        patient.setPhone(null);
        patient.setGoogleId(null);
    }
}