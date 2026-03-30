package com.example.empmgmt.service;

import com.example.empmgmt.domain.Employee;
import com.example.empmgmt.dto.request.EmployeeRequest;
import com.example.empmgmt.dto.response.EmployeeResponse;
import com.example.empmgmt.dto.response.PageResponse;
import com.example.empmgmt.mapper.EmployeeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeMapper employeeMapper;

    public PageResponse<EmployeeResponse> getEmployees(String search, Long departmentId, int page, int size) {
        int offset = page * size;
        List<Employee> employees = employeeMapper.findAll(search, departmentId, offset, size);
        int total = employeeMapper.countAll(search, departmentId);
        int totalPages = (int) Math.ceil((double) total / size);

        List<EmployeeResponse> content = employees.stream()
                .map(EmployeeResponse::from)
                .toList();

        return new PageResponse<>(content, page, size, total, totalPages);
    }

    public EmployeeResponse getEmployee(Long id) {
        Employee employee = employeeMapper.findById(id);
        if (employee == null) {
            throw new RuntimeException("직원을 찾을 수 없습니다: " + id);
        }
        return EmployeeResponse.from(employee);
    }

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .position(request.getPosition())
                .hireDate(request.getHireDate() != null ? LocalDate.parse(request.getHireDate()) : null)
                .salary(request.getSalary())
                .departmentId(request.getDepartmentId())
                .build();

        employeeMapper.insert(employee);
        return getEmployee(employee.getId());
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee existing = employeeMapper.findById(id);
        if (existing == null) {
            throw new RuntimeException("직원을 찾을 수 없습니다: " + id);
        }

        existing.setName(request.getName());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setPosition(request.getPosition());
        existing.setHireDate(request.getHireDate() != null ? LocalDate.parse(request.getHireDate()) : null);
        existing.setSalary(request.getSalary());
        existing.setDepartmentId(request.getDepartmentId());

        employeeMapper.update(existing);
        return getEmployee(id);
    }

    public void deleteEmployee(Long id) {
        employeeMapper.delete(id);
    }
}
