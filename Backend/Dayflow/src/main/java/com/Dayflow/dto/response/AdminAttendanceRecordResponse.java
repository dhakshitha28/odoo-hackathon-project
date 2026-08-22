package com.Dayflow.dto.response;

import com.Dayflow.model.AttendanceDayStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminAttendanceRecordResponse {
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String workHours;
    private String extraHours;
    private AttendanceDayStatus status;
}
