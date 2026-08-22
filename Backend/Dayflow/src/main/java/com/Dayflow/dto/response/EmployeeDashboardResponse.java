package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EmployeeDashboardResponse {
    private String employeeId;
    private String name;
    private String profilePictureUrl;
    private String jobPosition;
    private String department;
    private String email;
    private String mobile;
    private String company;
    private String manager;
    private String location;
    private EmployeeAttendanceTodayResponse todayAttendance;
    private long pendingLeaveCount;
    private List<NotificationResponse> notifications;
    private EmployeeAvatarResponse avatar;
    private EmployeeProfileCardResponse profileCard;
    private EmployeeAttendanceTodayResponse attendanceCard;
    private EmployeeLeaveSummaryResponse leaveRequestsCard;
}
