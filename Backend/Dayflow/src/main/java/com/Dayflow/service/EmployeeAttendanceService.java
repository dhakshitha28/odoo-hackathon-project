package com.Dayflow.service;

import com.Dayflow.dto.response.EmployeeAttendanceListResponse;
import com.Dayflow.dto.response.EmployeeAttendanceRecordResponse;
import com.Dayflow.dto.response.EmployeeAttendanceTodayResponse;
import com.Dayflow.exception.BadRequestException;
import com.Dayflow.model.Attendance;
import com.Dayflow.model.AttendanceDayStatus;
import com.Dayflow.model.TimeOffStatus;
import com.Dayflow.model.User;
import com.Dayflow.repository.AttendanceRepository;
import com.Dayflow.repository.TimeOffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeAttendanceService {

    private static final int HALF_DAY_MINUTES = 240;
    private static final int STANDARD_WORK_MINUTES = 480;

    private final EmployeeContextService employeeContextService;
    private final AttendanceRepository attendanceRepository;
    private final TimeOffRepository timeOffRepository;
    private final EmployeeNotificationService notificationService;

    @Transactional(readOnly = true)
    public EmployeeAttendanceListResponse getAttendance(Integer year, Integer month) {
        User employee = employeeContextService.requireEmployee();
        YearMonth period = resolvePeriod(year, month);
        LocalDateTime start = period.atDay(1).atStartOfDay();
        LocalDateTime end = period.plusMonths(1).atDay(1).atStartOfDay();

        List<EmployeeAttendanceRecordResponse> records = attendanceRepository
            .findByUserIdAndCheckInTimeGreaterThanEqualAndCheckInTimeLessThanOrderByCheckInTimeAsc(
                employee.getId(),
                start,
                end
            )
            .stream()
            .map(record -> toRecord(employee, record))
            .toList();

        long presentDays = records.stream()
            .filter(record -> record.getStatus() == AttendanceDayStatus.PRESENT
                || record.getStatus() == AttendanceDayStatus.HALF_DAY)
            .count();
        long leaveDays = records.stream()
            .filter(record -> record.getStatus() == AttendanceDayStatus.LEAVE)
            .count();

        return EmployeeAttendanceListResponse.builder()
            .today(getTodayAttendance(employee))
            .presentDays(presentDays)
            .leaveDays(leaveDays)
            .totalWorkingDays(period.lengthOfMonth())
            .records(records)
            .build();
    }

    @Transactional
    public EmployeeAttendanceTodayResponse checkIn() {
        User employee = employeeContextService.requireEmployee();
        LocalDate today = LocalDate.now();

        if (!recordsForDay(employee.getId(), today).isEmpty()) {
            throw new BadRequestException("You have already checked in today");
        }

        Attendance attendance = Attendance.builder()
            .user(employee)
            .checkInTime(LocalDateTime.now())
            .build();
        attendanceRepository.save(attendance);
        notificationService.notify(employee, "ATTENDANCE", "You checked in successfully.");
        return getTodayAttendance(employee);
    }

    @Transactional
    public EmployeeAttendanceTodayResponse checkOut() {
        User employee = employeeContextService.requireEmployee();
        List<Attendance> todayRecords = recordsForDay(employee.getId(), LocalDate.now());

        if (todayRecords.isEmpty()) {
            throw new BadRequestException("You have not checked in today");
        }

        Attendance open = todayRecords.stream()
            .filter(record -> record.getCheckOutTime() == null)
            .findFirst()
            .orElseThrow(() -> new BadRequestException("You have already checked out today"));

        open.setCheckOutTime(LocalDateTime.now());
        attendanceRepository.save(open);
        notificationService.notify(employee, "ATTENDANCE", "You checked out successfully.");
        return getTodayAttendance(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeAttendanceTodayResponse getTodayAttendance(User employee) {
        LocalDate today = LocalDate.now();
        List<Attendance> todayRecords = recordsForDay(employee.getId(), today);
        return summarize(employee, today, todayRecords);
    }

    private EmployeeAttendanceRecordResponse toRecord(User employee, Attendance attendance) {
        LocalDate date = attendance.getCheckInTime().toLocalDate();
        EmployeeAttendanceTodayResponse summary = summarize(employee, date, List.of(attendance));
        return EmployeeAttendanceRecordResponse.builder()
            .attendanceId(attendance.getId())
            .date(date)
            .checkInTime(summary.getCheckInTime())
            .checkOutTime(summary.getCheckOutTime())
            .workHours(summary.getWorkingHours())
            .extraHours(summary.getExtraHours())
            .status(summary.getStatus())
            .build();
    }

    private EmployeeAttendanceTodayResponse summarize(User employee, LocalDate date, List<Attendance> records) {
        boolean onLeave = timeOffRepository
            .existsByUserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                employee.getId(),
                TimeOffStatus.APPROVED,
                date,
                date
            );

        LocalDateTime checkIn = records.isEmpty() ? null : records.get(0).getCheckInTime();
        LocalDateTime checkOut = null;
        long minutes = 0;
        boolean checkedIn = false;

        for (Attendance record : records) {
            LocalDateTime out = record.getCheckOutTime();
            if (out == null) {
                checkedIn = true;
                out = LocalDateTime.now();
            } else {
                checkOut = record.getCheckOutTime();
            }
            minutes += Math.max(0, Duration.between(record.getCheckInTime(), out).toMinutes());
        }

        AttendanceDayStatus status;
        if (onLeave) {
            status = AttendanceDayStatus.LEAVE;
        } else if (records.isEmpty()) {
            status = AttendanceDayStatus.ABSENT;
        } else if (!checkedIn && minutes > 0 && minutes < HALF_DAY_MINUTES) {
            status = AttendanceDayStatus.HALF_DAY;
        } else {
            status = AttendanceDayStatus.PRESENT;
        }

        long extraMinutes = Math.max(0, minutes - STANDARD_WORK_MINUTES);

        return EmployeeAttendanceTodayResponse.builder()
            .checkInTime(checkIn)
            .checkOutTime(checkedIn ? null : checkOut)
            .status(status)
            .workingHours(formatClock(minutes))
            .extraHours(formatClock(extraMinutes))
            .workingMinutes(minutes)
            .checkedIn(checkedIn)
            .build();
    }

    private List<Attendance> recordsForDay(Long userId, LocalDate date) {
        return attendanceRepository
            .findByUserIdAndCheckInTimeGreaterThanEqualAndCheckInTimeLessThanOrderByCheckInTimeAsc(
                userId,
                date.atStartOfDay(),
                date.plusDays(1).atStartOfDay()
            );
    }

    private YearMonth resolvePeriod(Integer year, Integer month) {
        YearMonth now = YearMonth.now();
        if (year == null && month == null) {
            return now;
        }
        int resolvedYear = year == null ? now.getYear() : year;
        int resolvedMonth = month == null ? now.getMonthValue() : month;
        return YearMonth.of(resolvedYear, resolvedMonth);
    }

    private String formatClock(long minutes) {
        long hours = minutes / 60;
        long remaining = minutes % 60;
        return String.format("%02d:%02d", hours, remaining);
    }
}
