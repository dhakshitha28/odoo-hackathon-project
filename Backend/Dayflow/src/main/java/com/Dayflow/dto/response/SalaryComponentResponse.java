package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SalaryComponentResponse {
    private String label;
    private double amount;
    private String percentLabel;
    private String note;
}
