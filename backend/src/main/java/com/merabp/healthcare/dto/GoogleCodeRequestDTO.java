package com.merabp.healthcare.dto;

public class GoogleCodeRequestDTO {
    private String code;
    private String codeVerifier;
    private String redirectUri;
    private String clientId;

    public String getCode() { return code; }
    public String getCodeVerifier() { return codeVerifier; }
    public String getRedirectUri() { return redirectUri; }
    public String getClientId() { return clientId; }
}
