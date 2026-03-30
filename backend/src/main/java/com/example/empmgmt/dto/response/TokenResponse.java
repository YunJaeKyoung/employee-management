package com.example.empmgmt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenResponse {
    private String token;
    private String username;
    private String name;
    private String role;
}
