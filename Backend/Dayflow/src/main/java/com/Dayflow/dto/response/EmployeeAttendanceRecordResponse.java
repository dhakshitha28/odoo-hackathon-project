package com.Dayflow.dto.response;

import com.Dayflow.model.AttendanceDayStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EmployeeAttendanceRecordResponse {
    private Long attendanceId;
    private LocalDate date;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String workHours;
    private String extraHours;
    private AttendanceDayStatus status;
}
