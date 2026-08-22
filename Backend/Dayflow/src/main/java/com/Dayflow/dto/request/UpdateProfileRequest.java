package com.Dayflow.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {
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
    private Integer workingDaysPerWeek;
    private Double breakTimeHours;
}
