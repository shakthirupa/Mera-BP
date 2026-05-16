package com.merabp.healthcare.exception;

// DuplicateResourceException
// Thrown when a unique constraint would be violated (e.g. duplicate email/phone).
// Maps to HTTP 409 Conflict in GlobalExceptionHandler.

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}