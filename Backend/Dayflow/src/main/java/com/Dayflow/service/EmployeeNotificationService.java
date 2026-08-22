package com.Dayflow.service;

import com.Dayflow.dto.response.NotificationResponse;
import com.Dayflow.model.Notification;
import com.Dayflow.model.User;
import com.Dayflow.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeNotificationService {

    private final NotificationRepository notificationRepository;
    private final EmployeeContextService employeeContextService;

    @Transactional
    public void notify(User employee, String type, String message) {
        notificationRepository.save(Notification.builder()
            .user(employee)
            .type(type)
            .message(message)
            .readFlag(false)
            .createdAt(LocalDateTime.now())
            .build());
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications() {
        return getNotifications(employeeContextService.requireEmployee());
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(User employee) {
        return notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(employee.getId())
            .stream()
            .map(item -> NotificationResponse.builder()
                .id(item.getId())
                .type(item.getType())
                .message(item.getMessage())
                .read(item.isReadFlag())
                .createdAt(item.getCreatedAt())
                .build())
            .toList();
    }
}
