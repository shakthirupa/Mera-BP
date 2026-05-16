package com.merabp.healthcare.controller;

import com.merabp.healthcare.ai.ChatService;
import com.merabp.healthcare.dto.ChatRequestDTO;
import com.merabp.healthcare.model.Patient;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // POST /chat — protected by your existing JWT filter
    @PostMapping
    public ResponseEntity<Map<String, String>> chat(
            @AuthenticationPrincipal Patient patient,
            @Valid @RequestBody ChatRequestDTO request) {

        return ResponseEntity.ok(
                Map.of("message", chatService.chat(patient, request))
        );
    }
}