package com.merabp.healthcare.dto;

public class ChatResponseDTO {
    private String message;

    public ChatResponseDTO(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
