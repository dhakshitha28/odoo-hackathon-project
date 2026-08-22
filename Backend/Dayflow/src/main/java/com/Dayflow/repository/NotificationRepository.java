package com.Dayflow.repository;

import com.Dayflow.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
