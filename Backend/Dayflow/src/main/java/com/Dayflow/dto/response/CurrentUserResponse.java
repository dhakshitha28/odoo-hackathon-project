package com.Dayflow.dto.response;

import com.Dayflow.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CurrentUserResponse {
    private Long id;
    private String loginId;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private String profilePictureUrl;
    private String companyName;
    private String companyLogoUrl;
    private boolean checkedIn;
    private boolean canCreateEmployee;
}
