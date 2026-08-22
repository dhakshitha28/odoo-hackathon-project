package com.Dayflow.controller;

import com.Dayflow.dto.request.CreateLeaveRequest;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.LeaveBalanceResponse;
import com.Dayflow.dto.response.LeaveRequestResponse;
import com.Dayflow.service.EmployeeLeaveService;
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
public class EmployeeLeaveController {

    private final EmployeeLeaveService employeeLeaveService;

    @GetMapping("/leave-requests")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getLeaveRequests() {
        return ResponseEntity.ok(
            ApiResponse.<List<LeaveRequestResponse>>builder()
                .success(true)
                .message("Leave requests loaded")
                .data(employeeLeaveService.getLeaveRequests())
                .build()
        );
    }

    @PostMapping("/leave-requests")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> createLeaveRequest(
        @Valid @RequestBody CreateLeaveRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<LeaveRequestResponse>builder()
                .success(true)
                .message("Leave request submitted")
                .data(employeeLeaveService.createLeaveRequest(request))
                .build()
        );
    }

    @GetMapping("/leave-balance")
    public ResponseEntity<ApiResponse<LeaveBalanceResponse>> getLeaveBalance() {
        return ResponseEntity.ok(
            ApiResponse.<LeaveBalanceResponse>builder()
                .success(true)
                .message("Leave balance loaded")
                .data(employeeLeaveService.getLeaveBalance())
                .build()
        );
    }
}
