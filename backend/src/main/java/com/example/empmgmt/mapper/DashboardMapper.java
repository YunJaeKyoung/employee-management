package com.example.empmgmt.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface DashboardMapper {
    int getTotalEmployeeCount();
    int getTotalDepartmentCount();
    Long getAverageSalary();
    int getNewEmployeesThisMonth();
    List<Map<String, Object>> getEmployeeCountByDepartment();
    List<Map<String, Object>> getRecentEmployees();
}
