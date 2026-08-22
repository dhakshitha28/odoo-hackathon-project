package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeAllocationResponse {
    private String employeeId;
    private String employeeName;
    private double paidTimeOffAvailable;
    private double sickLeaveAvailable;
    private String unpaidLeaveInfo;
}
