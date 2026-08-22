package com.Dayflow.service;

import com.Dayflow.dto.response.AttendanceResponse;
import com.Dayflow.exception.BadRequestException;
import com.Dayflow.model.Attendance;
import com.Dayflow.model.User;
import com.Dayflow.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public AttendanceResponse checkIn() {
        User user = currentUserService.getCurrentUser();

        if (attendanceRepository.existsByUserIdAndCheckOutTimeIsNull(user.getId())) {
            throw new BadRequestException("You are already checked in");
        }

        Attendance attendance = Attendance.builder()
            .user(user)
            .checkInTime(LocalDateTime.now())
            .build();
        attendanceRepository.save(attendance);

        return AttendanceResponse.builder()
            .attendanceId(attendance.getId())
            .checkedIn(true)
            .checkInTime(attendance.getCheckInTime())
            .checkOutTime(null)
            .build();
    }

    @Transactional
    public AttendanceResponse checkOut() {
        User user = currentUserService.getCurrentUser();

        Attendance attendance = attendanceRepository
            .findFirstByUserIdAndCheckOutTimeIsNullOrderByCheckInTimeDesc(user.getId())
            .orElseThrow(() -> new BadRequestException("You are not checked in"));

        attendance.setCheckOutTime(LocalDateTime.now());
        attendanceRepository.save(attendance);

        return AttendanceResponse.builder()
            .attendanceId(attendance.getId())
            .checkedIn(false)
            .checkInTime(attendance.getCheckInTime())
            .checkOutTime(attendance.getCheckOutTime())
            .build();
    }
}
