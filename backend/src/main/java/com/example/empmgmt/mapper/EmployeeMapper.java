package com.example.empmgmt.mapper;

import com.example.empmgmt.domain.Employee;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmployeeMapper {
    List<Employee> findAll(@Param("search") String search,
                           @Param("departmentId") Long departmentId,
                           @Param("offset") int offset,
                           @Param("size") int size);

    int countAll(@Param("search") String search,
                 @Param("departmentId") Long departmentId);

    Employee findById(@Param("id") Long id);
    void insert(Employee employee);
    void update(Employee employee);
    void delete(@Param("id") Long id);
}
