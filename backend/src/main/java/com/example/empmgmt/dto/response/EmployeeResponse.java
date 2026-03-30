package com.example.empmgmt.dto.response;

import com.example.empmgmt.domain.Employee;
import lombok.Data;

@Data
public class EmployeeResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String position;
    private String hireDate;
    private Long salary;
    private Long departmentId;
    private String departmentName;

    public static EmployeeResponse from(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setName(employee.getName());
        response.setEmail(employee.getEmail());
        response.setPhone(employee.getPhone());
        response.setPosition(employee.getPosition());
        response.setHireDate(employee.getHireDate() != null ? employee.getHireDate().toString() : null);
        response.setSalary(employee.getSalary());
        response.setDepartmentId(employee.getDepartmentId());
        response.setDepartmentName(employee.getDepartmentName());
        return response;
    }
}
