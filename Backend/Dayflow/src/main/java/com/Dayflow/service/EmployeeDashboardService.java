package com.Dayflow.service;

import com.Dayflow.dto.response.EmployeeAttendanceTodayResponse;
import com.Dayflow.dto.response.EmployeeAvatarResponse;
import com.Dayflow.dto.response.EmployeeDashboardResponse;
import com.Dayflow.dto.response.EmployeeLeaveSummaryResponse;
import com.Dayflow.dto.response.EmployeeProfileCardResponse;
import com.Dayflow.dto.response.LeaveRequestResponse;
import com.Dayflow.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeDashboardService {

    private final EmployeeContextService employeeContextService;
    private final EmployeeProfileService employeeProfileService;
    private final EmployeeAttendanceService employeeAttendanceService;
    private final EmployeeLeaveService employeeLeaveService;
    private final EmployeeNotificationService employeeNotificationService;

    @Transactional(readOnly = true)
    public EmployeeDashboardResponse getDashboard() {
        User employee = employeeContextService.requireEmployee();
        EmployeeProfileCardResponse profileCard = employeeProfileService.toProfileCard(employee);
        EmployeeAttendanceTodayResponse today = employeeAttendanceService.getTodayAttendance(employee);
        List<LeaveRequestResponse> leaves = employeeLeaveService.getLeaveRequests(employee);

        return EmployeeDashboardResponse.builder()
            .employeeId(employee.getEmployeeId())
            .name(employeeProfileService.fullName(employee))
            .profilePictureUrl(employee.getProfilePictureUrl())
            .jobPosition(employee.getJobPosition())
            .department(employee.getDepartment())
            .email(employee.getEmail())
            .mobile(employee.getPhoneNumber())
            .company(employee.getCompany().getName())
            .manager(employeeProfileService.managerName(employee))
            .location(employeeProfileService.location(employee))
            .todayAttendance(today)
            .pendingLeaveCount(employeeLeaveService.pendingCount(employee))
            .notifications(employeeNotificationService.getNotifications(employee))
            .avatar(EmployeeAvatarResponse.builder()
                .profilePictureUrl(employee.getProfilePictureUrl())
                .name(employeeProfileService.fullName(employee))
                .employeeId(employee.getEmployeeId())
                .build())
            .profileCard(profileCard)
            .attendanceCard(today)
            .leaveRequestsCard(EmployeeLeaveSummaryResponse.builder()
                .pendingCount(employeeLeaveService.pendingCount(employee))
                .recent(leaves.stream().limit(5).toList())
                .build())
            .build();
    }
}
