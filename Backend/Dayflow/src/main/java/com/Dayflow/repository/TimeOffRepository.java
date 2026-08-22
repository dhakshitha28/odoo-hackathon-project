package com.Dayflow.repository;

import com.Dayflow.model.TimeOff;
import com.Dayflow.model.TimeOffStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TimeOffRepository extends JpaRepository<TimeOff, Long> {
    boolean existsByUserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Long userId,
        TimeOffStatus status,
        LocalDate startDate,
        LocalDate endDate
    );

    List<TimeOff> findByUserIdOrderByIdDesc(Long userId);

    long countByUserIdAndStatus(Long userId, TimeOffStatus status);
}
