package com.Dayflow.dto.response;

import com.Dayflow.model.EmployeeStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeCardResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
    private EmployeeStatus status;
}
