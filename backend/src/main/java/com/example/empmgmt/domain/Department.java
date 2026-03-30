package com.example.empmgmt.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    // 집계용 필드
    private Integer employeeCount;
}
