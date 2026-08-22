package com.Dayflow.service;

import com.Dayflow.dto.response.AdminAttendanceListResponse;
import com.Dayflow.dto.response.AdminAttendanceRecordResponse;
import com.Dayflow.model.Attendance;
import com.Dayflow.model.AttendanceDayStatus;
import com.Dayflow.model.Role;
import com.Dayflow.model.TimeOffStatus;
import com.Dayflow.model.User;
import com.Dayflow.repository.AttendanceRepository;
import com.Dayflow.repository.TimeOffRepository;
import com.Dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAttendanceService {

    private static final int STANDARD_WORK_MINUTES = 480;
    private static final int HALF_DAY_MINUTES = 240;

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final TimeOffRepository timeOffRepository;

    @Transactional(readOnly = true)
    public AdminAttendanceListResponse getAttendanceList(LocalDate date, String search) {
        User currentUser = currentUserService.getCurrentUser();
        LocalDate targetDate = date != null ? date : LocalDate.now();
        String query = search == null ? "" : search.trim();

        List<User> employees = userRepository.searchCompanyEmployees(
            currentUser.getCompany().getId(),
            query
        ).stream()
            .filter(user -> user.getRole() == Role.EMPLOYEE)
            .toList();

        LocalDateTime start = targetDate.atStartOfDay();
        LocalDateTime end = targetDate.plusDays(1).atStartOfDay();

        List<Attendance> dayRecords = attendanceRepository
            .findByCompanyAndDateRange(
                currentUser.getCompany().getId(),
                start,
                end
            );

        Map<Long, List<Attendance>> recordsByUser = dayRecords.stream()
            .collect(Collectors.groupingBy(attendance -> attendance.getUser().getId()));

        List<AdminAttendanceRecordResponse> records = new ArrayList<>();
        for (User employee : employees) {
            records.add(buildRecord(employee, recordsByUser.getOrDefault(employee.getId(), List.of()), targetDate));
        }

        records.sort(Comparator.comparing(AdminAttendanceRecordResponse::getEmployeeName, String.CASE_INSENSITIVE_ORDER));

        return AdminAttendanceListResponse.builder()
            .date(targetDate)
            .records(records)
            .build();
    }

    private AdminAttendanceRecordResponse buildRecord(User employee, List<Attendance> dayRecords, LocalDate date) {
        boolean onLeave = timeOffRepository
            .existsByUserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                employee.getId(),
                TimeOffStatus.APPROVED,
                date,
                date
            );

        if (dayRecords.isEmpty()) {
            AttendanceDayStatus status = onLeave ? AttendanceDayStatus.LEAVE : AttendanceDayStatus.ABSENT;
            return AdminAttendanceRecordResponse.builder()
                .employeeId(employee.getId())
                .employeeName(fullName(employee))
                .employeeCode(employee.getEmployeeId())
                .status(status)
                .build();
        }

        List<Attendance> sorted = dayRecords.stream()
            .sorted(Comparator.comparing(Attendance::getCheckInTime))
            .toList();

        LocalDateTime checkIn = sorted.get(0).getCheckInTime();
        LocalDateTime checkOut = null;
        long totalMinutes = 0;
        boolean checkedIn = false;
        boolean isToday = date.equals(LocalDate.now());

        for (Attendance record : sorted) {
            LocalDateTime out = record.getCheckOutTime();
            if (out == null) {
                if (isToday) {
                    checkedIn = true;
                    out = LocalDateTime.now();
                } else {
                    continue;
                }
            } else {
                checkOut = record.getCheckOutTime();
            }
            totalMinutes += Duration.between(record.getCheckInTime(), out).toMinutes();
        }

        AttendanceDayStatus status;
        if (onLeave) {
            status = AttendanceDayStatus.LEAVE;
        } else if (!checkedIn && totalMinutes > 0 && totalMinutes < HALF_DAY_MINUTES) {
            status = AttendanceDayStatus.HALF_DAY;
        } else {
            status = AttendanceDayStatus.PRESENT;
        }

        long extraMinutes = Math.max(0, totalMinutes - STANDARD_WORK_MINUTES);

        return AdminAttendanceRecordResponse.builder()
            .employeeId(employee.getId())
            .employeeName(fullName(employee))
            .employeeCode(employee.getEmployeeId())
            .checkInTime(checkIn)
            .checkOutTime(checkedIn ? null : checkOut)
            .workHours(formatDuration(totalMinutes))
            .extraHours(extraMinutes > 0 ? formatDuration(extraMinutes) : null)
            .status(status)
            .build();
    }

    private String fullName(User user) {
        return user.getFirstName() + " " + user.getLastName();
    }

    private String formatDuration(long minutes) {
        long hours = minutes / 60;
        long remaining = minutes % 60;
        return String.format("%02d:%02d", hours, remaining);
    }
}
