package com.merabp.healthcare.service;

import com.merabp.healthcare.exception.BusinessRuleException;
import com.merabp.healthcare.model.OtpPurpose;
import com.merabp.healthcare.model.OtpVerification;
import com.merabp.healthcare.repository.OtpVerificationRepository;
import com.merabp.healthcare.util.HashUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int OTP_LENGTH         = 6;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${mail.from:727723euci043@skcet.ac.in}")
    private String mailFrom;

    private final OtpVerificationRepository otpRepo;

    public OtpService(OtpVerificationRepository otpRepo) {
        this.otpRepo = otpRepo;
    }

    @Transactional
    public LocalDateTime generateAndSendOtp(String email, OtpPurpose purpose) {
        otpRepo.deleteAllByEmailAndPurpose(email, purpose);

        String plainOtp  = generateOtp();
        String hashedOtp = HashUtil.sha256(plainOtp);

        OtpVerification otpVerification = new OtpVerification(
                email, hashedOtp,
                LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES),
                purpose
        );

        otpRepo.save(otpVerification);
        sendOtpEmail(email, plainOtp, purpose);
        return otpVerification.getExpiresAt();
    }

    @Transactional
    public void verifyOtp(String email, String plainOtp, OtpPurpose purpose) {
        OtpVerification record = otpRepo
                .findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByExpiresAtDesc(
                        email, purpose, LocalDateTime.now())
                .orElseThrow(() -> new BusinessRuleException(
                        "OTP has expired or does not exist. Please request a new one."));

        if (!HashUtil.sha256(plainOtp).equals(record.getOtp())) {
            throw new BusinessRuleException("Invalid OTP. Please try again.");
        }
        record.setUsed(true);
    }

    @Scheduled(fixedRateString = "PT1H")
    @Transactional
    public void cleanupExpiredOtps() {
        otpRepo.deleteAllExpired(LocalDateTime.now());
        log.info("Expired OTPs cleaned up");
    }

    private String generateOtp() {
        int otp = SECURE_RANDOM.nextInt((int) Math.pow(10, OTP_LENGTH));
        return String.format("%0" + OTP_LENGTH + "d", otp);
    }

    @Async
    private void sendOtpEmail(String toEmail, String otp, OtpPurpose purpose) {
        String subject = purpose == OtpPurpose.REGISTRATION ? "Verify your email" : "Reset your password";
        String body = purpose == OtpPurpose.REGISTRATION
                ? String.format("Welcome! Your verification OTP is: %s%n%nThis OTP is valid for %d minutes.", otp, OTP_EXPIRY_MINUTES)
                : String.format("Your password reset OTP is: %s%n%nThis OTP is valid for %d minutes.", otp, OTP_EXPIRY_MINUTES);

        String json = String.format(
                "{\"sender\":{\"email\":\"%s\"},\"to\":[{\"email\":\"%s\"}],\"subject\":\"%s\",\"textContent\":\"%s\"}",
                mailFrom, toEmail, subject, body.replace("\n", "\\n")
        );

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("accept", "application/json")
                    .header("api-key", brevoApiKey)
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            log.info("Brevo email sent to {}: status {}", toEmail, response.statusCode());
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }
}

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int OTP_LENGTH         = 6;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final OtpVerificationRepository otpRepo;
    private final JavaMailSender mailSender;

    public OtpService(OtpVerificationRepository otpRepo, JavaMailSender mailSender) {
        this.otpRepo    = otpRepo;
        this.mailSender = mailSender;
    }

    // ── Generate, hash, save, and send OTP ───────────────────────────────────

    @Transactional
    public LocalDateTime generateAndSendOtp(String email, OtpPurpose purpose) {

        // Delete any previous OTPs for this email + purpose before creating a new one
        otpRepo.deleteAllByEmailAndPurpose(email, purpose);

        String plainOtp  = generateOtp();
        String hashedOtp = HashUtil.sha256(plainOtp);

        OtpVerification otpVerification = new OtpVerification(
                email,
                hashedOtp,   // store hash — never store plain OTP in DB
                LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES),
                purpose
        );

        otpRepo.save(otpVerification);
        // Send plain OTP in email — user never sees the hash
        sendOtpEmail(email, plainOtp, purpose);
        return otpVerification.getExpiresAt();
    }

    // ── Verify OTP ────────────────────────────────────────────────────────────

    @Transactional
    public void verifyOtp(String email, String plainOtp, OtpPurpose purpose) {

        OtpVerification record = otpRepo
                .findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByExpiresAtDesc(
                        email, purpose, LocalDateTime.now())
                .orElseThrow(() -> new BusinessRuleException(
                        "OTP has expired or does not exist. Please request a new one."));

        // Hash the incoming OTP and compare against stored hash
        if (!HashUtil.sha256(plainOtp).equals(record.getOtp())) {
            throw new BusinessRuleException("Invalid OTP. Please try again.");
        }

        // Mark as used so it cannot be replayed
        record.setUsed(true);
    }

    // ── Scheduled cleanup — runs every hour ───────────────────────────────────

    @Scheduled(fixedRateString = "PT1H")
    @Transactional
    public void cleanupExpiredOtps() {
        otpRepo.deleteAllExpired(LocalDateTime.now());
        log.info("Expired OTPs cleaned up");
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private String generateOtp() {
        int otp = SECURE_RANDOM.nextInt((int) Math.pow(10, OTP_LENGTH));
        return String.format("%0" + OTP_LENGTH + "d", otp);
    }

    @Async
    private void sendOtpEmail(String toEmail, String otp, OtpPurpose purpose) {

        String subject = purpose == OtpPurpose.REGISTRATION
                ? "Verify your email"
                : "Reset your password";

        String body = purpose == OtpPurpose.REGISTRATION
                ? String.format(
                "Welcome! Your verification OTP is: %s%n%n" +
                        "This OTP is valid for %d minutes.%n" +
                        "If you did not request this, please ignore this email.",
                otp, OTP_EXPIRY_MINUTES)
                : String.format(
                "Your password reset OTP is: %s%n%n" +
                        "This OTP is valid for %d minutes.%n" +
                        "If you did not request this, please secure your account immediately.",
                otp, OTP_EXPIRY_MINUTES);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}