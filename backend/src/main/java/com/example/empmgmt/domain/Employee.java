package com.example.empmgmt.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String position;
    private LocalDate hireDate;
    private Long salary;
    private Long departmentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 조인용 필드
    private String departmentName;
}
