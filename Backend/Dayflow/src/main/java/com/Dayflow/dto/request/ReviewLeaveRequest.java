package com.Dayflow.dto.request;

import com.Dayflow.model.TimeOffStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewLeaveRequest {
    @NotNull(message = "Status is required")
    private TimeOffStatus status;
}
