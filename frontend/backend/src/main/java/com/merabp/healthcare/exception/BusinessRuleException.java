package com.merabp.healthcare.exception;

public class BusinessRuleException extends RuntimeException {

    private final String code;

    public BusinessRuleException(String message) {
        super(message);
        this.code = null;
    }

    public BusinessRuleException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}