package com.Dayflow.service;

import com.Dayflow.dto.response.SalaryBreakdownResponse;
import com.Dayflow.dto.response.SalaryComponentResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryCalculationService {

    public SalaryBreakdownResponse calculate(double monthlyWage, int workingDaysPerWeek, double breakTimeHours) {
        double w = monthlyWage > 0 ? monthlyWage : 0;

        double basic = round(w * 0.5);
        double hra = round(basic * 0.5);
        double standardAllowance = 4167;
        double performanceBonus = round(basic * 0.0833);
        double leaveTravelAllowance = round(basic * 0.0833);
        double others = basic + hra + standardAllowance + performanceBonus + leaveTravelAllowance;
        double fixedAllowance = round(Math.max(0, w - others));
        double employeePf = round(basic * 0.12);
        double employerPf = round(basic * 0.12);
        double professionalTax = 200;

        double fixedPercent = w > 0 ? round((fixedAllowance / w) * 10000) / 100.0 : 0;

        List<SalaryComponentResponse> salaryComponents = List.of(
            component(
                "Basic Salary",
                basic,
                "50.00 %",
                "Define Basic salary from company cost compute it based on monthly Wages."
            ),
            component(
                "House Rent Allowance",
                hra,
                "50.00 %",
                "HRA provided to employees 50% of the basic salary."
            ),
            component(
                "Standard Allowance",
                standardAllowance,
                "16.67 %",
                "A standard allowance is a predetermined, fixed amount provided to employee as part of their salary."
            ),
            component(
                "Performance Bonus",
                performanceBonus,
                "8.33 %",
                "Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary."
            ),
            component(
                "Leave Travel Allowance",
                leaveTravelAllowance,
                "8.33 %",
                "LTA is paid by the company to employees to cover their travel expenses and calculated as a % of the basic salary."
            ),
            component(
                "Fixed Allowance",
                fixedAllowance,
                String.format("%.2f %%", fixedPercent),
                "fixed allowance portion of wages is determined after calculating all salary components."
            )
        );

        List<SalaryComponentResponse> pfContributions = List.of(
            component(
                "Employee PF",
                employeePf,
                "12.00 %",
                "PF is calculated based on the basic salary."
            ),
            component(
                "Employer PF",
                employerPf,
                "12.00 %",
                "PF is calculated based on the basic salary."
            )
        );

        List<SalaryComponentResponse> taxDeductions = List.of(
            component(
                "Professional Tax",
                professionalTax,
                "",
                "Professional Tax deducted from the Gross salary."
            )
        );

        return SalaryBreakdownResponse.builder()
            .monthlyWage(w)
            .yearlyWage(round(w * 12))
            .workingDaysPerWeek(workingDaysPerWeek)
            .breakTimeHours(breakTimeHours)
            .salaryComponents(salaryComponents)
            .pfContributions(pfContributions)
            .taxDeductions(taxDeductions)
            .build();
    }

    private SalaryComponentResponse component(String label, double amount, String percentLabel, String note) {
        return SalaryComponentResponse.builder()
            .label(label)
            .amount(amount)
            .percentLabel(percentLabel)
            .note(note)
            .build();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
