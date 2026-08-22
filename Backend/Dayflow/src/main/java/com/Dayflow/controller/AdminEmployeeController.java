package com.Dayflow.controller;

import com.Dayflow.dto.request.CreateEmployeeRequest;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.CreateEmployeeResponse;
import com.Dayflow.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/employees")
@RequiredArgsConstructor
public class AdminEmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<CreateEmployeeResponse>> createEmployee(
        @Valid @RequestBody CreateEmployeeRequest request
    ) {
        CreateEmployeeResponse response = employeeService.createEmployee(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<CreateEmployeeResponse>builder()
                .success(true)
                .message("Employee created successfully")
                .data(response)
                .build()
        );
    }
}
