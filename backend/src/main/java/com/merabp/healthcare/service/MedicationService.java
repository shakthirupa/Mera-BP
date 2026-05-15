package com.merabp.healthcare.service;

import com.merabp.healthcare.dto.MedicationRequestDTO;
import com.merabp.healthcare.dto.MedicationResponseDTO;
import com.merabp.healthcare.exception.ResourceNotFoundException;
import com.merabp.healthcare.model.Medication;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.repository.MedicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepo;

    public MedicationService(MedicationRepository medicationRepo) {
        this.medicationRepo = medicationRepo;
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public MedicationResponseDTO addMedication(Patient patient, MedicationRequestDTO request) {
        Medication medication = new Medication(
                patient,
                request.getName(),
                request.getPurpose(),
                request.getInstructions()
        );

        return MedicationResponseDTO.from(medicationRepo.save(medication));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<MedicationResponseDTO> getByPatient(Long patientId) {
        return medicationRepo.findAllByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(MedicationResponseDTO::from)
                .toList();
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Transactional
    public MedicationResponseDTO updateMedication(Long patientId, Long medicationId,
                                                  MedicationRequestDTO request) {
        Medication medication = medicationRepo
                .findByIdAndPatientId(medicationId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medication not found with id: " + medicationId));

        medication.setName(request.getName());
        medication.setPurpose(request.getPurpose());
        medication.setInstructions(request.getInstructions());

        return MedicationResponseDTO.from(medication);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void deleteMedication(Long patientId, Long medicationId) {
        Medication medication = medicationRepo
                .findByIdAndPatientId(medicationId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medication not found with id: " + medicationId));

        medicationRepo.delete(medication);
    }

}