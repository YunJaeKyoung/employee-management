package com.example.empmgmt.mapper;

import com.example.empmgmt.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    User findByUsername(@Param("username") String username);
    void insert(User user);
    boolean existsByUsername(@Param("username") String username);
}
