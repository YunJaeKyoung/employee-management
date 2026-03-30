package com.example.empmgmt.dto.response;

import com.example.empmgmt.domain.Department;
import lombok.Data;

@Data
public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private Integer employeeCount;

    public static DepartmentResponse from(Department department) {
        DepartmentResponse response = new DepartmentResponse();
        response.setId(department.getId());
        response.setName(department.getName());
        response.setDescription(department.getDescription());
        response.setEmployeeCount(department.getEmployeeCount());
        return response;
    }
}
