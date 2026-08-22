package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EmployeeLeaveSummaryResponse {
    private long pendingCount;
    private List<LeaveRequestResponse> recent;
}
