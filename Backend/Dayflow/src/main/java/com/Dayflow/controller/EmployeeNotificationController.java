package com.Dayflow.controller;

import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.NotificationResponse;
import com.Dayflow.service.EmployeeNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employee/notifications")
@RequiredArgsConstructor
public class EmployeeNotificationController {

    private final EmployeeNotificationService employeeNotificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications() {
        return ResponseEntity.ok(
            ApiResponse.<List<NotificationResponse>>builder()
                .success(true)
                .message("Notifications loaded")
                .data(employeeNotificationService.getNotifications())
                .build()
        );
    }
}
