package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaveBalanceResponse {
    private double paidTimeOffAvailable;
    private double sickLeaveAvailable;
    private String unpaidLeaveInfo;
}
