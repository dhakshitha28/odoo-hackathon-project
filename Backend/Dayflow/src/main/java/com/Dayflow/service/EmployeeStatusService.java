package com.Dayflow.service;

import com.Dayflow.model.EmployeeStatus;
import com.Dayflow.model.TimeOffStatus;
import com.Dayflow.repository.AttendanceRepository;
import com.Dayflow.repository.TimeOffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmployeeStatusService {

    private final AttendanceRepository attendanceRepository;
    private final TimeOffRepository timeOffRepository;

    public EmployeeStatus resolveStatus(Long userId) {
        LocalDate today = LocalDate.now();
        boolean onLeave = timeOffRepository
            .existsByUserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                userId,
                TimeOffStatus.APPROVED,
                today,
                today
            );

        if (onLeave) {
            return EmployeeStatus.ON_LEAVE;
        }

        if (attendanceRepository.existsByUserIdAndCheckOutTimeIsNull(userId)) {
            return EmployeeStatus.PRESENT;
        }

        return EmployeeStatus.ABSENT;
    }

    public boolean isCheckedIn(Long userId) {
        return attendanceRepository.existsByUserIdAndCheckOutTimeIsNull(userId);
    }
}
