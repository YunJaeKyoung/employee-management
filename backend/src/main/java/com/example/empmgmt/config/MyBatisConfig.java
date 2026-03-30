package com.example.empmgmt.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.example.empmgmt.mapper")
public class MyBatisConfig {
}
