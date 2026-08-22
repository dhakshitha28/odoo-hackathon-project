package com.Dayflow.dto.response;

import com.Dayflow.model.AttendanceDayStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EmployeeAttendanceTodayResponse {
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private AttendanceDayStatus status;
    private String workingHours;
    private long workingMinutes;
    private boolean checkedIn;
}
