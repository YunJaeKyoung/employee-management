package com.example.empmgmt.mapper;

import com.example.empmgmt.domain.Department;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DepartmentMapper {
    List<Department> findAll();
    List<Department> findAllWithCount();
    Department findById(@Param("id") Long id);
    void insert(Department department);
    void update(Department department);
    void delete(@Param("id") Long id);
}
