package com.merabp.healthcare.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequestDTO {

    // Google ID token issued by the Google SDK on the device
    // Backend verifies this with Google's public keys
    @NotBlank(message = "Google ID token is required")
    private String idToken;

    public String getIdToken() { return idToken; }
    public void setIdToken(String idToken) { this.idToken = idToken; }
}