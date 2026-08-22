package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeProfileCardResponse {
    private String profilePictureUrl;
    private String name;
    private String employeeId;
    private String jobPosition;
    private String department;
    private String email;
    private String mobile;
    private String company;
    private String manager;
    private String location;
}
