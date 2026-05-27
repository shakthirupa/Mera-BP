package com.merabp.healthcare.repository;

import com.merabp.healthcare.model.GlucoseContext;
import com.merabp.healthcare.model.Observation;
import com.merabp.healthcare.model.ObservationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    Optional<Observation> findByIdAndPatientId(Long id, Long patientId);

    @Modifying
    @Query("DELETE FROM Observation o WHERE o.patient.id = :patientId")
    void deleteAllByPatientId(@Param("patientId") Long patientId);
}