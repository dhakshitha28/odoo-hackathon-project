package com.Dayflow.service;

import com.Dayflow.dto.request.CreateLeaveRequest;
import com.Dayflow.dto.response.*;
import com.Dayflow.exception.BadRequestException;
import com.Dayflow.exception.ForbiddenException;
import com.Dayflow.model.*;
import com.Dayflow.repository.AttendanceRepository;
import com.Dayflow.repository.NotificationRepository;
import com.Dayflow.repository.TimeOffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeDashboardService {

    private static final int HALF_DAY_MINUTES = 240;

    private final CurrentUserService currentUserService;
    private final AttendanceService attendanceService;
    private final AttendanceRepository attendanceRepository;
    private final TimeOffRepository timeOffRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public EmployeeDashboardResponse getDashboard() {
        User employee = requireEmployee();
        List<LeaveRequestResponse> leaves = getLeaveRequests(employee);

        return EmployeeDashboardResponse.builder()
            .avatar(EmployeeAvatarResponse.builder()
                .profilePictureUrl(employee.getProfilePictureUrl())
                .name(fullName(employee))
                .employeeId(employee.getEmployeeId())
                .build())
            .profileCard(toProfileCard(employee))
            .attendanceCard(getTodayAttendance(employee))
            .leaveRequestsCard(EmployeeLeaveSummaryResponse.builder()
                .pendingCount(timeOffRepository.countByUserIdAndStatus(employee.getId(), TimeOffStatus.PENDING))
                .recent(leaves.stream().limit(5).toList())
                .build())
            .notifications(getNotifications(employee))
            .build();
    }

    @Transactional(readOnly = true)
    public EmployeeProfileResponse getProfile() {
        User employee = requireEmployee();
        return EmployeeProfileResponse.builder()
            .basic(EmployeeProfileResponse.Basic.builder()
                .profilePictureUrl(employee.getProfilePictureUrl())
                .name(fullName(employee))
                .jobPosition(employee.getJobPosition())
                .email(employee.getEmail())
                .mobile(employee.getPhoneNumber())
                .company(employee.getCompany().getName())
                .department(employee.getDepartment())
                .manager(managerName(employee))
                .location(location(employee))
                .build())
            .resume(EmployeeProfileResponse.Resume.builder()
                .resumeUrl(employee.getResumeUrl())
                .skills(employee.getSkills())
                .certifications(employee.getCertifications())
                .build())
            .privateInfo(EmployeeProfileResponse.PrivateInfo.builder()
                .dateOfBirth(employee.getDateOfBirth())
                .residingAddress(residingAddress(employee))
                .nationality(employee.getNationality())
                .personalEmail(employee.getPersonalEmail())
                .gender(employee.getGender())
                .maritalStatus(employee.getMaritalStatus())
                .dateOfJoining(employee.getDateOfJoining())
                .build())
            .salaryInfo(EmployeeProfileResponse.SalaryInfo.builder()
                .salary(employee.getSalary())
                .readOnly(true)
                .build())
            .bankDetails(EmployeeProfileResponse.BankDetails.builder()
                .accountNumber(employee.getAccountNumber())
                .bankName(employee.getBankName())
                .ifscCode(employee.getIfscCode())
                .panNumber(employee.getPanNumber())
                .uanNumber(employee.getUanNumber())
                .employeeCode(employee.getEmployeeId())
                .build())
            .security(EmployeeProfileResponse.Security.builder()
                .emailVerified(employee.isEmailVerified())
                .loginId(employee.getLoginId())
                .build())
            .build();
    }

    @Transactional(readOnly = true)
    public EmployeeAttendanceListResponse getAttendance() {
        User employee = requireEmployee();
        List<EmployeeAttendanceRecordResponse> records = attendanceRepository
            .findByUserIdOrderByCheckInTimeDesc(employee.getId())
            .stream()
            .map(this::toRecord)
            .toList();

        return EmployeeAttendanceListResponse.builder()
            .today(getTodayAttendance(employee))
            .records(records)
            .build();
    }

    @Transactional
    public EmployeeAttendanceTodayResponse checkIn() {
        User employee = requireEmployee();
        attendanceService.checkIn();
        notify(employee, "ATTENDANCE", "You checked in successfully.");
        return getTodayAttendance(employee);
    }

    @Transactional
    public EmployeeAttendanceTodayResponse checkOut() {
        User employee = requireEmployee();
        attendanceService.checkOut();
        notify(employee, "ATTENDANCE", "You checked out successfully.");
        return getTodayAttendance(employee);
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getLeaveRequests() {
        return getLeaveRequests(requireEmployee());
    }

    @Transactional
    public LeaveRequestResponse createLeaveRequest(CreateLeaveRequest request) {
        User employee = requireEmployee();

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        TimeOff leave = TimeOff.builder()
            .user(employee)
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .leaveType(request.getLeaveType())
            .reason(request.getReason())
            .status(TimeOffStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .build();
        timeOffRepository.save(leave);

        notify(employee, "LEAVE_REQUEST", "Your leave request was submitted and is pending approval.");

        return toLeave(leave);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications() {
        return getNotifications(requireEmployee());
    }

    private User requireEmployee() {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() != Role.EMPLOYEE) {
            throw new ForbiddenException("User does not have permission");
        }
        return user;
    }

    private EmployeeProfileCardResponse toProfileCard(User employee) {
        return EmployeeProfileCardResponse.builder()
            .profilePictureUrl(employee.getProfilePictureUrl())
            .name(fullName(employee))
            .employeeId(employee.getEmployeeId())
            .jobPosition(employee.getJobPosition())
            .department(employee.getDepartment())
            .email(employee.getEmail())
            .mobile(employee.getPhoneNumber())
            .company(employee.getCompany().getName())
            .manager(managerName(employee))
            .location(location(employee))
            .build();
    }

    private EmployeeAttendanceTodayResponse getTodayAttendance(User employee) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        boolean onLeave = timeOffRepository
            .existsByUserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                employee.getId(),
                TimeOffStatus.APPROVED,
                today,
                today
            );

        List<Attendance> todayRecords = attendanceRepository
            .findByUserIdAndCheckInTimeGreaterThanEqualAndCheckInTimeLessThanOrderByCheckInTimeAsc(
                employee.getId(),
                start,
                end
            );

        LocalDateTime checkIn = todayRecords.isEmpty() ? null : todayRecords.get(0).getCheckInTime();
        LocalDateTime checkOut = null;
        long minutes = 0;
        boolean checkedIn = false;

        for (Attendance record : todayRecords) {
            LocalDateTime out = record.getCheckOutTime();
            if (out == null) {
                checkedIn = true;
                out = LocalDateTime.now();
            } else {
                checkOut = record.getCheckOutTime();
            }
            minutes += Duration.between(record.getCheckInTime(), out).toMinutes();
        }

        AttendanceDayStatus status;
        if (onLeave) {
            status = AttendanceDayStatus.LEAVE;
        } else if (todayRecords.isEmpty()) {
            status = AttendanceDayStatus.ABSENT;
        } else if (!checkedIn && minutes > 0 && minutes < HALF_DAY_MINUTES) {
            status = AttendanceDayStatus.HALF_DAY;
        } else {
            status = AttendanceDayStatus.PRESENT;
        }

        return EmployeeAttendanceTodayResponse.builder()
            .checkInTime(checkIn)
            .checkOutTime(checkedIn ? null : checkOut)
            .status(status)
            .workingHours(formatHours(minutes))
            .workingMinutes(minutes)
            .checkedIn(checkedIn)
            .build();
    }

    private EmployeeAttendanceRecordResponse toRecord(Attendance attendance) {
        LocalDateTime end = attendance.getCheckOutTime() == null ? LocalDateTime.now() : attendance.getCheckOutTime();
        long minutes = Duration.between(attendance.getCheckInTime(), end).toMinutes();
        return EmployeeAttendanceRecordResponse.builder()
            .attendanceId(attendance.getId())
            .checkInTime(attendance.getCheckInTime())
            .checkOutTime(attendance.getCheckOutTime())
            .workingHours(formatHours(minutes))
            .build();
    }

    private List<LeaveRequestResponse> getLeaveRequests(User employee) {
        return timeOffRepository.findByUserIdOrderByIdDesc(employee.getId())
            .stream()
            .map(this::toLeave)
            .toList();
    }

    private LeaveRequestResponse toLeave(TimeOff leave) {
        return LeaveRequestResponse.builder()
            .id(leave.getId())
            .startDate(leave.getStartDate())
            .endDate(leave.getEndDate())
            .leaveType(leave.getLeaveType())
            .reason(leave.getReason())
            .status(leave.getStatus())
            .createdAt(leave.getCreatedAt())
            .build();
    }

    private List<NotificationResponse> getNotifications(User employee) {
        return notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(employee.getId())
            .stream()
            .map(item -> NotificationResponse.builder()
                .id(item.getId())
                .type(item.getType())
                .message(item.getMessage())
                .read(item.isReadFlag())
                .createdAt(item.getCreatedAt())
                .build())
            .collect(Collectors.toList());
    }

    private void notify(User employee, String type, String message) {
        notificationRepository.save(Notification.builder()
            .user(employee)
            .type(type)
            .message(message)
            .readFlag(false)
            .createdAt(LocalDateTime.now())
            .build());
    }

    private String fullName(User user) {
        return user.getFirstName() + " " + user.getLastName();
    }

    private String managerName(User user) {
        if (user.getManager() == null) {
            return null;
        }
        return fullName(user.getManager());
    }

    private String location(User user) {
        return joinNonBlank(user.getCity(), user.getState(), user.getCountry());
    }

    private String residingAddress(User user) {
        return joinNonBlank(user.getAddress(), user.getCity(), user.getState(), user.getCountry(), user.getPinCode());
    }

    private String joinNonBlank(String... parts) {
        String result = java.util.Arrays.stream(parts)
            .filter(part -> part != null && !part.isBlank())
            .collect(Collectors.joining(", "));
        return result.isBlank() ? null : result;
    }

    private String formatHours(long minutes) {
        long hours = minutes / 60;
        long remaining = minutes % 60;
        return hours + "h " + remaining + "m";
    }
}
