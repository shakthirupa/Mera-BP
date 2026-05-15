package com.merabp.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class ChatRequestDTO {

    @NotBlank(message = "Message is required")
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    private String message;

    private List<String> history;

    public ChatRequestDTO() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getHistory() { return history; }
    public void setHistory(List<String> history) { this.history = history; }
}