package com.Dayflow.controller;

import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.AttendanceResponse;
import com.Dayflow.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkIn() {
        AttendanceResponse response = attendanceService.checkIn();

        return ResponseEntity.ok(
            ApiResponse.<AttendanceResponse>builder()
                .success(true)
                .message("Checked in successfully")
                .data(response)
                .build()
        );
    }

    @PostMapping("/check-out")
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkOut() {
        AttendanceResponse response = attendanceService.checkOut();

        return ResponseEntity.ok(
            ApiResponse.<AttendanceResponse>builder()
                .success(true)
                .message("Checked out successfully")
                .data(response)
                .build()
        );
    }
}
