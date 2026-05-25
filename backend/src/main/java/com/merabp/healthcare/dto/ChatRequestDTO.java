package com.merabp.healthcare.dto;

import java.util.List;

public class ChatRequestDTO {
    private String message;
    private List<String> history;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public List<String> getHistory() { return history; }
    public void setHistory(List<String> history) { this.history = history; }
}
