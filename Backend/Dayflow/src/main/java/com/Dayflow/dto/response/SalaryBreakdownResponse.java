package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SalaryBreakdownResponse {
    private double monthlyWage;
    private double yearlyWage;
    private int workingDaysPerWeek;
    private double breakTimeHours;
    private List<SalaryComponentResponse> salaryComponents;
    private List<SalaryComponentResponse> pfContributions;
    private List<SalaryComponentResponse> taxDeductions;
}
