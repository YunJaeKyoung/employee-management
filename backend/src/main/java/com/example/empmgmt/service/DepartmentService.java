package com.example.empmgmt.service;

import com.example.empmgmt.domain.Department;
import com.example.empmgmt.dto.request.DepartmentRequest;
import com.example.empmgmt.dto.response.DepartmentResponse;
import com.example.empmgmt.mapper.DepartmentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentMapper departmentMapper;

    public List<DepartmentResponse> getAllDepartments() {
        return departmentMapper.findAllWithCount().stream()
                .map(DepartmentResponse::from)
                .toList();
    }

    public DepartmentResponse getDepartment(Long id) {
        Department department = departmentMapper.findById(id);
        if (department == null) {
            throw new RuntimeException("부서를 찾을 수 없습니다: " + id);
        }
        return DepartmentResponse.from(department);
    }

    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        departmentMapper.insert(department);
        return DepartmentResponse.from(department);
    }

    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department existing = departmentMapper.findById(id);
        if (existing == null) {
            throw new RuntimeException("부서를 찾을 수 없습니다: " + id);
        }

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        departmentMapper.update(existing);

        return DepartmentResponse.from(existing);
    }

    public void deleteDepartment(Long id) {
        departmentMapper.delete(id);
    }
}
