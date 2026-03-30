package com.example.empmgmt.service;

import com.example.empmgmt.dto.response.DashboardResponse;
import com.example.empmgmt.mapper.DashboardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardMapper dashboardMapper;

    public DashboardResponse getStats() {
        DashboardResponse response = new DashboardResponse();
        response.setTotalEmployees(dashboardMapper.getTotalEmployeeCount());
        response.setTotalDepartments(dashboardMapper.getTotalDepartmentCount());
        response.setAverageSalary(dashboardMapper.getAverageSalary());
        response.setNewEmployeesThisMonth(dashboardMapper.getNewEmployeesThisMonth());
        response.setEmployeesByDepartment(dashboardMapper.getEmployeeCountByDepartment());
        response.setRecentEmployees(dashboardMapper.getRecentEmployees());
        return response;
    }
}
