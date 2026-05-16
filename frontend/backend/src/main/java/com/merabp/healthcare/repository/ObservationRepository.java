package com.merabp.healthcare.repository;

import com.merabp.healthcare.model.GlucoseContext;
import com.merabp.healthcare.model.Observation;
import com.merabp.healthcare.model.ObservationCode;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ObservationRepository extends JpaRepository<Observation, Long> {

    // All observations for a patient (paginated)
    List<Observation> findAllByPatientIdOrderByEffectiveDateTimeDesc(Long patientId);

    // Filter by patient + code (paginated)
    List<Observation> findAllByPatientIdAndCodeOrderByEffectiveDateTimeDesc(Long patientId, ObservationCode code);

    List<Observation> findAllByPatientIdAndCodeAndContextOrderByEffectiveDateTimeDesc(Long patientId, ObservationCode code, GlucoseContext context);

    // Single observation — also checks patient ownership (prevents cross-patient access)
    Optional<Observation> findByIdAndPatientId(Long id, Long patientId);

}