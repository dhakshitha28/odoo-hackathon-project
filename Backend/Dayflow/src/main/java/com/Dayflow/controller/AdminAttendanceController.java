package com.Dayflow.controller;

import com.Dayflow.dto.response.AdminAttendanceListResponse;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.service.AdminAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/attendance")
@RequiredArgsConstructor
public class AdminAttendanceController {

    private final AdminAttendanceService adminAttendanceService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<AdminAttendanceListResponse>> getAttendanceList(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam(required = false) String search
    ) {
        AdminAttendanceListResponse response = adminAttendanceService.getAttendanceList(date, search);
        return ResponseEntity.ok(
            ApiResponse.<AdminAttendanceListResponse>builder()
                .success(true)
                .message("Attendance list fetched successfully")
                .data(response)
                .build()
        );
    }
}
