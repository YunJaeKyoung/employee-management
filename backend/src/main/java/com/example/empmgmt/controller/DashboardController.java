package com.example.empmgmt.controller;

import com.example.empmgmt.dto.response.DashboardResponse;
import com.example.empmgmt.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardResponse> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }
}
