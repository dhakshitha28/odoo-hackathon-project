package com.Dayflow.controller;

import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.EmployeeDashboardResponse;
import com.Dayflow.service.EmployeeDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee/dashboard")
@RequiredArgsConstructor
public class EmployeeDashboardController {

    private final EmployeeDashboardService employeeDashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<EmployeeDashboardResponse>> getDashboard() {
        return ResponseEntity.ok(
            ApiResponse.<EmployeeDashboardResponse>builder()
                .success(true)
                .message("Employee dashboard loaded")
                .data(employeeDashboardService.getDashboard())
                .build()
        );
    }
}
