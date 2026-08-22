package com.Dayflow.controller;

import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.DashboardResponse;
import com.Dayflow.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
        @RequestParam(required = false) String search
    ) {
        DashboardResponse response = dashboardService.getDashboard(search);

        return ResponseEntity.ok(
            ApiResponse.<DashboardResponse>builder()
                .success(true)
                .message("Dashboard loaded")
                .data(response)
                .build()
        );
    }
}
