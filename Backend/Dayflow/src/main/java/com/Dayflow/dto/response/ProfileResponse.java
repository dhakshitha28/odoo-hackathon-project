package com.Dayflow.dto.response;

import com.Dayflow.model.Role;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String loginId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String companyName;
    private String companyLogoUrl;
    private String profilePictureUrl;
    private String department;
    private String managerName;
    private String location;
    private String about;
    private String jobLoves;
    private String interestsHobbies;
    private String resumeText;
    private List<String> skills;
    private List<String> certifications;
    private Double monthlyWage;
}
