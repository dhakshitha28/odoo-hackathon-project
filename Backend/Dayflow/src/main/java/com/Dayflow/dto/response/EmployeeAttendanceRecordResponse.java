package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EmployeeAttendanceRecordResponse {
    private Long attendanceId;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String workingHours;
}
