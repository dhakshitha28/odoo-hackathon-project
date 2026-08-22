package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class AdminAttendanceListResponse {
    private LocalDate date;
    private List<AdminAttendanceRecordResponse> records;
}
