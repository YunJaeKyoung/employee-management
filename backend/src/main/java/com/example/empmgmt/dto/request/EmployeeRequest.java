package com.example.empmgmt.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeeRequest {
    @NotBlank(message = "이름은 필수입니다")
    private String name;
    private String email;
    private String phone;
    private String position;
    private String hireDate;
    private Long salary;
    private Long departmentId;
}
