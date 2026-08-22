package com.Dayflow.dto.response;

import com.Dayflow.model.LeaveType;
import com.Dayflow.model.TimeOffStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class LeaveRequestResponse {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private LeaveType leaveType;
    private String reason;
    private TimeOffStatus status;
    private LocalDateTime createdAt;
}
