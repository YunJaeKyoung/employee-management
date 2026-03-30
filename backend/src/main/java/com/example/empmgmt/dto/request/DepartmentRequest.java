package com.example.empmgmt.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {
    @NotBlank(message = "부서명은 필수입니다")
    private String name;
    private String description;
}
