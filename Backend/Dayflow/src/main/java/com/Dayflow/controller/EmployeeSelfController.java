package com.Dayflow.controller;

import com.Dayflow.dto.request.CreateLeaveRequest;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.EmployeeAttendanceListResponse;
import com.Dayflow.dto.response.EmployeeAttendanceTodayResponse;
import com.Dayflow.dto.response.EmployeeDashboardResponse;
import com.Dayflow.dto.response.EmployeeProfileResponse;
import com.Dayflow.dto.response.LeaveRequestResponse;
import com.Dayflow.dto.response.NotificationResponse;
import com.Dayflow.service.EmployeeDashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeSelfController {

    private final EmployeeDashboardService employeeDashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<EmployeeDashboardResponse>> getDashboard() {
        return ok("Employee dashboard loaded", employeeDashboardService.getDashboard());
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<EmployeeProfileResponse>> getProfile() {
        return ok("Profile loaded", employeeDashboardService.getProfile());
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<EmployeeAttendanceListResponse>> getAttendance() {
        return ok("Attendance loaded", employeeDashboardService.getAttendance());
    }

    @PostMapping("/attendance/check-in")
    public ResponseEntity<ApiResponse<EmployeeAttendanceTodayResponse>> checkIn() {
        return ok("Checked in successfully", employeeDashboardService.checkIn());
    }

    @PostMapping("/attendance/check-out")
    public ResponseEntity<ApiResponse<EmployeeAttendanceTodayResponse>> checkOut() {
        return ok("Checked out successfully", employeeDashboardService.checkOut());
    }

    @GetMapping("/leave-requests")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getLeaveRequests() {
        return ok("Leave requests loaded", employeeDashboardService.getLeaveRequests());
    }

    @PostMapping("/leave-requests")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> createLeaveRequest(
        @Valid @RequestBody CreateLeaveRequest request
    ) {
        LeaveRequestResponse response = employeeDashboardService.createLeaveRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<LeaveRequestResponse>builder()
                .success(true)
                .message("Leave request submitted")
                .data(response)
                .build()
        );
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications() {
        return ok("Notifications loaded", employeeDashboardService.getNotifications());
    }

    private <T> ResponseEntity<ApiResponse<T>> ok(String message, T data) {
        return ResponseEntity.ok(
            ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build()
        );
    }
}
