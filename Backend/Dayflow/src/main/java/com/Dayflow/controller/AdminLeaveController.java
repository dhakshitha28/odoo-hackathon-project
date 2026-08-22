package com.Dayflow.controller;

import com.Dayflow.dto.request.ReviewLeaveRequest;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.LeaveRequestResponse;
import com.Dayflow.service.EmployeeLeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/leave-requests")
@RequiredArgsConstructor
public class AdminLeaveController {

    private final EmployeeLeaveService employeeLeaveService;

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> reviewLeave(
        @PathVariable Long id,
        @Valid @RequestBody ReviewLeaveRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.<LeaveRequestResponse>builder()
                .success(true)
                .message("Leave request updated")
                .data(employeeLeaveService.reviewLeave(id, request.getStatus()))
                .build()
        );
    }
}
