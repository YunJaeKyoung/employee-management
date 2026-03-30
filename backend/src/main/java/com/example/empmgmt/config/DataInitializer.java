package com.example.empmgmt.config;

import com.example.empmgmt.domain.User;
import com.example.empmgmt.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 앱 시작 시 기본 관리자 계정을 생성합니다.
 * data.sql에 BCrypt 해시를 하드코딩하는 대신,
 * PasswordEncoder를 사용하여 런타임에 올바른 해시를 생성합니다.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // admin 계정이 없으면 생성
        if (!userMapper.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .name("관리자")
                    .email("admin@company.com")
                    .role("ADMIN")
                    .build();
            userMapper.insert(admin);
        }
    }
}
