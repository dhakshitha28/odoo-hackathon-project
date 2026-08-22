package com.Dayflow.controller;

import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.EmployeeAttendanceListResponse;
import com.Dayflow.dto.response.EmployeeAttendanceTodayResponse;
import com.Dayflow.service.EmployeeAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee/attendance")
@RequiredArgsConstructor
public class EmployeeAttendanceController {

    private final EmployeeAttendanceService employeeAttendanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<EmployeeAttendanceListResponse>> getAttendance(
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) Integer month
    ) {
        return ResponseEntity.ok(
            ApiResponse.<EmployeeAttendanceListResponse>builder()
                .success(true)
                .message("Attendance loaded")
                .data(employeeAttendanceService.getAttendance(year, month))
                .build()
        );
    }

    @PostMapping("/check-in")
    public ResponseEntity<ApiResponse<EmployeeAttendanceTodayResponse>> checkIn() {
        return ResponseEntity.ok(
            ApiResponse.<EmployeeAttendanceTodayResponse>builder()
                .success(true)
                .message("Checked in successfully")
                .data(employeeAttendanceService.checkIn())
                .build()
        );
    }

    @PostMapping("/check-out")
    public ResponseEntity<ApiResponse<EmployeeAttendanceTodayResponse>> checkOut() {
        return ResponseEntity.ok(
            ApiResponse.<EmployeeAttendanceTodayResponse>builder()
                .success(true)
                .message("Checked out successfully")
                .data(employeeAttendanceService.checkOut())
                .build()
        );
    }
}
