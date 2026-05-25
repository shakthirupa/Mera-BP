package com.merabp.healthcare.controller;

import com.merabp.healthcare.dto.ChatRequestDTO;
import com.merabp.healthcare.dto.ChatResponseDTO;
import com.merabp.healthcare.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {
        String reply = chatService.getResponse(
            request.getMessage(),
            request.getHistory() != null ? request.getHistory() : java.util.List.of()
        );
        return ResponseEntity.ok(new ChatResponseDTO(reply));
    }
}
