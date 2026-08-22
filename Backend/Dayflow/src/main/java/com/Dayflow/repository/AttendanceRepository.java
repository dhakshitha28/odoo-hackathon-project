package com.Dayflow.repository;

import com.Dayflow.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findFirstByUserIdAndCheckOutTimeIsNullOrderByCheckInTimeDesc(Long userId);

    boolean existsByUserIdAndCheckOutTimeIsNull(Long userId);

    List<Attendance> findByUserIdAndCheckInTimeGreaterThanEqualAndCheckInTimeLessThanOrderByCheckInTimeAsc(
        Long userId,
        LocalDateTime start,
        LocalDateTime end
    );

    List<Attendance> findByUserIdOrderByCheckInTimeDesc(Long userId);
}
