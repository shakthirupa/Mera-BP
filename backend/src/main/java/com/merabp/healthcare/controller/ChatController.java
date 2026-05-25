package com.merabp.healthcare.controller;

import com.merabp.healthcare.dto.ChatRequestDTO;
import com.merabp.healthcare.dto.ChatResponseDTO;
import com.merabp.healthcare.model.Patient;
import com.merabp.healthcare.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> chat(
            @AuthenticationPrincipal Patient patient,
            @RequestBody ChatRequestDTO request) {
        String reply = chatService.getResponse(
            request.getMessage(),
            request.getHistory() != null ? request.getHistory() : java.util.List.of(),
            patient
        );
        return ResponseEntity.ok(new ChatResponseDTO(reply));
    }
}
