package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EmployeeDashboardResponse {
    private EmployeeAvatarResponse avatar;
    private EmployeeProfileCardResponse profileCard;
    private EmployeeAttendanceTodayResponse attendanceCard;
    private EmployeeLeaveSummaryResponse leaveRequestsCard;
    private List<NotificationResponse> notifications;
}
