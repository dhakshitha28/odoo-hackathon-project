package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeAvatarResponse {
    private String profilePictureUrl;
    private String name;
    private String employeeId;
}
