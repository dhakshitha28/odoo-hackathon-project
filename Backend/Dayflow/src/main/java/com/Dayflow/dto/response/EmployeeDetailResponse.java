package com.Dayflow.dto.response;

import com.Dayflow.model.EmployeeStatus;
import com.Dayflow.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeDetailResponse {
    private Long id;
    private String employeeId;
    private String loginId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Role role;
    private int yearOfJoining;
    private String profilePictureUrl;
    private String companyName;
    private EmployeeStatus status;
}
