package com.example.empmgmt.dto.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class DashboardResponse {
    private int totalEmployees;
    private int totalDepartments;
    private long averageSalary;
    private int newEmployeesThisMonth;
    private List<Map<String, Object>> employeesByDepartment;
    private List<Map<String, Object>> recentEmployees;
}
