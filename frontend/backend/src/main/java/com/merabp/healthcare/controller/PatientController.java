package com.merabp.healthcare.controller;

import com.merabp.healthcare.dto.PatientResponseDTO;
import com.merabp.healthcare.dto.PatientUpdateRequestDTO;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }


    // GET /api/v1/patients?page=0&size=20&sort=name,asc

    @GetMapping
    public ResponseEntity<Page<PatientResponseDTO>> getAllPatients(
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {

        return ResponseEntity.ok(patientService.getAllPatients(pageable));
    }

    @GetMapping("/profile")
    public ResponseEntity<PatientResponseDTO> getPatient(
            @AuthenticationPrincipal Patient patient) {
        return ResponseEntity.ok(PatientResponseDTO.from(patient));
    }

    // GET /api/v1/patients/{id}

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> getPatientById(
            @AuthenticationPrincipal Patient patient ) {
        return ResponseEntity.ok(patientService.getById(patient.getId()));
    }

    // GET /api/v1/patients/search?email=...

    @GetMapping(value = "/search", params = "email")
    public ResponseEntity<PatientResponseDTO> getPatientByEmail(
            @RequestParam String email) {

        return ResponseEntity.ok(patientService.getByEmail(email));
    }

    // GET /patients/search?phone=...

    @GetMapping(value = "/search", params = "phone")
    public ResponseEntity<PatientResponseDTO> getPatientByPhone(
            @RequestParam String phone) {

        return ResponseEntity.ok(patientService.getByPhone(phone));
    }


    // PUT /patients/{id}

    @PutMapping
    public ResponseEntity<PatientResponseDTO> updatePatient(
            @AuthenticationPrincipal Patient patient,
            @Valid @RequestBody PatientUpdateRequestDTO request) {

        return ResponseEntity.ok(patientService.updatePatient(patient.getId(), request));
    }

    // DELETE /patients/{id}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();  // 204
    }

    // DELETE /patients/me

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteOwnAccount(
            @AuthenticationPrincipal Patient patient) {
        patientService.deletePatient(patient.getId());
        return ResponseEntity.noContent().build();
    }
}