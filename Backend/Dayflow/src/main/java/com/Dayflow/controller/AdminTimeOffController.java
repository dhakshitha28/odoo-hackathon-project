package com.Dayflow.controller;

import com.Dayflow.dto.request.RejectTimeOffRequest;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.EmployeeAllocationResponse;
import com.Dayflow.dto.response.LeaveRequestResponse;
import com.Dayflow.model.TimeOffStatus;
import com.Dayflow.service.EmployeeLeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/time-off")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'HR')")
public class AdminTimeOffController {

    private final EmployeeLeaveService employeeLeaveService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> list(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) TimeOffStatus status
    ) {
        return ResponseEntity.ok(
            ApiResponse.<List<LeaveRequestResponse>>builder()
                .success(true)
                .message("Time Off records loaded")
                .data(employeeLeaveService.listCompanyTimeOff(search, status))
                .build()
        );
    }

    @GetMapping("/allocations")
    public ResponseEntity<ApiResponse<List<EmployeeAllocationResponse>>> allocations() {
        return ResponseEntity.ok(
            ApiResponse.<List<EmployeeAllocationResponse>>builder()
                .success(true)
                .message("Leave allocations loaded")
                .data(employeeLeaveService.listCompanyAllocations())
                .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.<LeaveRequestResponse>builder()
                .success(true)
                .message("Time Off request loaded")
                .data(employeeLeaveService.getCompanyTimeOff(id))
                .build()
        );
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> approve(@PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.<LeaveRequestResponse>builder()
                .success(true)
                .message("Time Off request approved")
                .data(employeeLeaveService.approveTimeOff(id))
                .build()
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> reject(
        @PathVariable Long id,
        @RequestBody(required = false) RejectTimeOffRequest request
    ) {
        String comment = request == null ? null : request.getComment();
        return ResponseEntity.ok(
            ApiResponse.<LeaveRequestResponse>builder()
                .success(true)
                .message("Time Off request rejected")
                .data(employeeLeaveService.rejectTimeOff(id, comment))
                .build()
        );
    }
}
