package com.example.empmgmt.service;

import com.example.empmgmt.domain.User;
import com.example.empmgmt.dto.request.LoginRequest;
import com.example.empmgmt.dto.request.SignupRequest;
import com.example.empmgmt.dto.response.TokenResponse;
import com.example.empmgmt.mapper.UserMapper;
import com.example.empmgmt.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public void signup(SignupRequest request) {
        if (userMapper.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 존재하는 아이디입니다: " + request.getUsername());
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .email(request.getEmail())
                .role("USER")
                .build();

        userMapper.insert(user);
    }

    public TokenResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userMapper.findByUsername(request.getUsername());

        return new TokenResponse(token, user.getUsername(), user.getName(), user.getRole());
    }
}
