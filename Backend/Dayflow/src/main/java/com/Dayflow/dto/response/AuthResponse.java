package com.Dayflow.dto.response;

import com.Dayflow.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String loginId;
    private String email;
    private Role role;
    private String companyName;
    private boolean emailVerified;
}