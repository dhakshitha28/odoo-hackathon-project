package com.Dayflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private CurrentUserResponse currentUser;
    private List<EmployeeCardResponse> employees;
}
