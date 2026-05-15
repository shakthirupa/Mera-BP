package com.merabp.healthcare.service;

import com.merabp.healthcare.dto.ObservationRequestDTO;
import com.merabp.healthcare.dto.ObservationResponseDTO;
import com.merabp.healthcare.exception.BusinessRuleException;
import com.merabp.healthcare.exception.ResourceNotFoundException;
import com.merabp.healthcare.model.GlucoseContext;
import com.merabp.healthcare.model.Observation;
import com.merabp.healthcare.model.ObservationCode;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.repository.ObservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ObservationService {

    private final ObservationRepository observationRepo;

    public ObservationService(ObservationRepository observationRepo) {
        this.observationRepo = observationRepo;
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public ObservationResponseDTO addObservation(Patient patient, ObservationRequestDTO request) {

        ObservationCode code = request.getCode();

        validateBusinessRules(code, request);

        Observation observation = new Observation(
                patient,
                code,
                request.getValue1(),
                request.getValue2(),
                request.getContext(),
                request.getEffectiveDateTime(),
                request.getNotes()
        );

        return ObservationResponseDTO.from(observationRepo.save(observation));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ObservationResponseDTO> getObservationsForPatient(
            Long patientId, ObservationCode code, GlucoseContext context) {

        // context without code is ambiguous — reject early
        if (code == null && context != null) {
            throw new BusinessRuleException(
                    "context filter can only be used when code is also provided");
        }

        List<Observation> observations;

        if (code != null && context != null) {
            observations = observationRepo
                    .findAllByPatientIdAndCodeAndContextOrderByEffectiveDateTimeDesc(
                            patientId, code, context);
        } else if (code != null) {
            observations = observationRepo
                    .findAllByPatientIdAndCodeOrderByEffectiveDateTimeDesc(patientId, code);
        } else {
            observations = observationRepo
                    .findAllByPatientIdOrderByEffectiveDateTimeDesc(patientId);
        }

        return observations.stream()
                .map(ObservationResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ObservationResponseDTO getObservation(Long patientId, Long observationId) {
        return observationRepo.findByIdAndPatientId(observationId, patientId)
                .map(ObservationResponseDTO::from)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Observation not found with id: " + observationId));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Transactional
    public ObservationResponseDTO updateObservation(Long patientId, Long observationId,
                                                    ObservationRequestDTO request) {
        Observation observation = observationRepo
                .findByIdAndPatientId(observationId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Observation not found with id: " + observationId));

        ObservationCode code = request.getCode();
        validateBusinessRules(code, request);

        observation.setCode(code);
        observation.setValue1(request.getValue1());
        observation.setValue2(request.getValue2());
        observation.setContext(request.getContext());
        observation.setEffectiveDateTime(request.getEffectiveDateTime());
        observation.setNotes(request.getNotes());

        return ObservationResponseDTO.from(observation);    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void deleteObservation(Long patientId, Long observationId) {
        Observation observation = observationRepo
                .findByIdAndPatientId(observationId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Observation not found with id: " + observationId));

        // Hard delete — erroneous observation entries (e.g. wrong value recorded)
        // should be fully removed. Patient accounts are soft-deleted, not observations.
        observationRepo.delete(observation);
    }

    private void validateBusinessRules(ObservationCode code, ObservationRequestDTO request) {

        if (request.getValue1() == null) {
            throw new BusinessRuleException("value1 is required");
        }

        // value2 required only for BLOOD_PRESSURE
        if (code.requiresValue2() && request.getValue2() == null) {
            throw new BusinessRuleException(
                    code + " requires both systolic (value1) and diastolic (value2)");
        }

        // value2 should not be sent for non-BP codes
        if (!code.requiresValue2() && request.getValue2() != null) {
            throw new BusinessRuleException(
                    code + " does not use value2 — remove it from the request");
        }

        // context required only for BLOOD_GLUCOSE
        if (code.requiresContext() && request.getContext() == null) {
            throw new BusinessRuleException(
                    code + " requires a glucose context (FASTING or POST_PRANDIAL)");
        }

        // context should not be sent for non-glucose codes
        if (!code.requiresContext() && request.getContext() != null) {
            throw new BusinessRuleException(
                    code + " does not use context — remove it from the request");
        }

        // Physiological range validation using enum metadata
        if (!code.isValue1InRange(request.getValue1())) {
            throw new BusinessRuleException(
                    String.format("value1 %.2f is outside the valid range [%.1f – %.1f] for %s",
                            request.getValue1(), code.getValue1Min(), code.getValue1Max(), code));
        }

        if (code.requiresValue2() && !code.isValue2InRange(request.getValue2())) {
            throw new BusinessRuleException(
                    String.format("value2 %.2f is outside the valid range [%.1f – %.1f] for %s",
                            request.getValue2(), code.getValue2Min(), code.getValue2Max(), code));
        }
    }
}