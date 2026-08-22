package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceResponse {
    private Long attendanceId;
    private boolean checkedIn;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
}
