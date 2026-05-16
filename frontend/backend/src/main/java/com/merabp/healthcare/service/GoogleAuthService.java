package com.merabp.healthcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.merabp.healthcare.dto.AuthResponseDTO;
import com.merabp.healthcare.dto.GoogleAuthRequestDTO;
import com.merabp.healthcare.dto.GoogleCodeRequestDTO;
import com.merabp.healthcare.dto.GoogleCompleteRequestDTO;
import com.merabp.healthcare.exception.BusinessRuleException;
import com.merabp.healthcare.model.AuthProvider;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.repository.PatientRepository;
import com.merabp.healthcare.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GoogleAuthService {

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${google.client-secret}")
    private String googleClientSecret;

    @Value("${google.android-client-id:}")
    private String googleAndroidClientId;

    private final PatientRepository patientRepo;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public GoogleAuthService(PatientRepository patientRepo,
                             JwtService jwtService,
                             RefreshTokenService refreshTokenService) {
        this.patientRepo         = patientRepo;
        this.jwtService          = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    // ── STEP 1 (code flow) ────────────────────────────────────────────────────
    // Expo sends authorization code + codeVerifier, backend exchanges for id_token

    @Transactional
    public AuthResponseDTO handleGoogleCode(GoogleCodeRequestDTO request) {
        try {
            String requestClientId = request.getClientId();
            String tokenClientId = isBlank(requestClientId) ? googleClientId : requestClientId;
            boolean usesWebClient = googleClientId.equals(tokenClientId);

            StringBuilder body = new StringBuilder()
                    .append("code=").append(urlEncode(request.getCode()))
                    .append("&client_id=").append(urlEncode(tokenClientId))
                    .append("&redirect_uri=").append(urlEncode(request.getRedirectUri()))
                    .append("&grant_type=authorization_code")
                    .append("&code_verifier=").append(urlEncode(request.getCodeVerifier()));

            if (usesWebClient && !isBlank(googleClientSecret)) {
                body.append("&client_secret=").append(urlEncode(googleClientSecret));
            }

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                    .build();

            HttpResponse<String> response = client.send(tokenRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode tokens = new ObjectMapper().readTree(response.body());

            String idToken = tokens.path("id_token").asText();
            if (idToken == null || idToken.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Failed to get id_token from Google.");
            }

            GoogleAuthRequestDTO dto = new GoogleAuthRequestDTO();
            dto.setIdToken(idToken);
            return handleGoogleAuth(dto);

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google code exchange failed: " + e.getMessage());
        }
    }

    // ── STEP 1 ────────────────────────────────────────────────────────────────
    // React Native sends the Google ID token it received from the Google SDK
    //
    // Three outcomes:
    //   A) Existing Google user             → issue JWT immediately (sign in)
    //   B) Email exists as email/password   → link Google, issue JWT
    //   C) new user                   → return onboarding token (sign up)

    @Transactional
    public AuthResponseDTO handleGoogleAuth(GoogleAuthRequestDTO request) {

        GoogleIdToken.Payload payload = verifyGoogleToken(request.getIdToken());

        String googleId = payload.getSubject();  // stable unique Google user ID
        String email    = payload.getEmail();
        String name     = (String) payload.get("name");

        // ── A: existing Google user — straight sign in ────────────────────────
        Optional<Patient> byGoogleId =
                patientRepo.findByGoogleIdAndDeletedFalse(googleId);

        if (byGoogleId.isPresent()) {
            return issueTokenPair("Login successful.", byGoogleId.get());
        }

        // ── B: email already registered via email/password — link accounts ────
        // We never create a duplicate. We attach googleId to the existing record.
        Optional<Patient> byEmail =
                patientRepo.findByEmailAndDeletedFalse(email);

        if (byEmail.isPresent()) {
            Patient patient = byEmail.get();

            // Linking is safe — Google already verified this email
            patient.setGoogleId(googleId);
            patient.setAuthProvider(
                    patient.getAuthProvider() == AuthProvider.EMAIL
                            ? AuthProvider.BOTH
                            : patient.getAuthProvider());

            return issueTokenPair("Google account linked. Login successful.", patient);
        }

        // ── C: new user — return short-lived onboarding token ──────────
        // No Patient row created yet. Frontend must call /auth/google/complete.
        String onboardingToken =
                jwtService.generateOnboardingToken(googleId, email, name);

        return AuthResponseDTO.onboarding(onboardingToken, name);
    }

    // ── STEP 2 ────────────────────────────────────────────────────────────────
    // Called after user fills in DOB, gender, and accepts T&C
    // Creates the Patient row and issues a real JWT

    @Transactional
    public AuthResponseDTO completeOnboarding(
            String token,
            GoogleCompleteRequestDTO request) {

        // Validate onboarding token — rejects expired, tampered, or SESSION tokens
        if (!jwtService.isOnboardingTokenValid(token)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Session timed out. Please sign in with Google again.");
        }

        String googleId = jwtService.extractGoogleId(token);
        String email    = jwtService.extractEmail(token);
        String name     = jwtService.extractName(token);

        // Idempotency guard — if /complete is called twice, don't create a duplicate
        if (patientRepo.findByGoogleIdAndDeletedFalse(googleId).isPresent()) {
            throw new BusinessRuleException(
                    "Account already exists. Please log in.");
        }

        // Also guard email — race condition where email was registered between
        // /auth/google and /auth/google/complete
        if (patientRepo.findByEmailAndDeletedFalse(email).isPresent()) {
            throw new BusinessRuleException(
                    "An account with this email already exists. Please log in.");
        }

        Patient patient = Patient.googleUser(
                name,
                request.getDateOfBirth(),
                request.getGender(),
                email,
                googleId
        );
        patient.setTermsAcceptedAt(LocalDateTime.now());
        patientRepo.save(patient);

        return issueTokenPair("Registration successful.", patient);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private AuthResponseDTO issueTokenPair(String message, Patient patient) {
        String accessToken  = jwtService.generateToken(patient);
        String refreshToken = refreshTokenService.generateRefreshToken(patient);
        return AuthResponseDTO.withTokens(message, accessToken, refreshToken);
    }

    // Verifies the Google ID token using Google's public keys
    // Throws 401 if token is invalid, tampered, or for a different client
    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(getAllowedClientIds())
                    .build();
            System.out.println("google...");
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid Google token. Please try again.");
            }

            return idToken.getPayload();

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Failed to verify Google token. Please try again.");
        }
    }

    private List<String> getAllowedClientIds() {
        List<String> clientIds = new ArrayList<>();
        clientIds.add(googleClientId);
        if (!isBlank(googleAndroidClientId)) {
            clientIds.add(googleAndroidClientId);
        }
        return clientIds;
    }

    private static String urlEncode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
