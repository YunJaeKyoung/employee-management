package com.example.empmgmt.controller;

import com.example.empmgmt.dto.request.LoginRequest;
import com.example.empmgmt.dto.request.SignupRequest;
import com.example.empmgmt.dto.response.TokenResponse;
import com.example.empmgmt.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            authService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "회원가입이 완료되었습니다"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            TokenResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "아이디 또는 비밀번호가 올바르지 않습니다"));
        }
    }
}
