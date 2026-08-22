package com.Dayflow.dto.response;

import com.Dayflow.model.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CreateEmployeeResponse {
    private String employeeId;
    private String name;
    private String email;
    private String department;
    private String jobPosition;
    private LocalDate dateOfJoining;
    private Role role;
}
