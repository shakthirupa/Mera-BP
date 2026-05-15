package com.merabp.healthcare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class PasswordEncoderConfig {

    // Strength 10 — Spring Security default, ~100ms per hash (good balance)
    // Strength 12 doubles the time to ~400ms with no real benefit for a mobile app
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}