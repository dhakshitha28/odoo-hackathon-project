package com.Dayflow.controller;

import com.Dayflow.dto.request.UpdateEmployeeProfileRequest;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.EmployeeProfileResponse;
import com.Dayflow.service.EmployeeProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee/profile")
@RequiredArgsConstructor
public class EmployeeProfileController {

    private final EmployeeProfileService employeeProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<EmployeeProfileResponse>> getProfile() {
        return ResponseEntity.ok(
            ApiResponse.<EmployeeProfileResponse>builder()
                .success(true)
                .message("Profile loaded")
                .data(employeeProfileService.getProfile())
                .build()
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<EmployeeProfileResponse>> updateProfile(
        @Valid @RequestBody UpdateEmployeeProfileRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.<EmployeeProfileResponse>builder()
                .success(true)
                .message("Profile updated")
                .data(employeeProfileService.updateProfile(request))
                .build()
        );
    }
}
