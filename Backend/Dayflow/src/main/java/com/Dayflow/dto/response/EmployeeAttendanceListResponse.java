package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EmployeeAttendanceListResponse {
    private EmployeeAttendanceTodayResponse today;
    private List<EmployeeAttendanceRecordResponse> records;
}
