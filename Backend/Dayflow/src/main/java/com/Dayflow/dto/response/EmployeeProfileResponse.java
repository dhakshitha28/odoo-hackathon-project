package com.Dayflow.dto.response;

import com.Dayflow.model.Gender;
import com.Dayflow.model.MaritalStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EmployeeProfileResponse {
    private Basic basic;
    private Resume resume;
    private PrivateInfo privateInfo;
    private SalaryInfo salaryInfo;
    private BankDetails bankDetails;
    private Security security;

    @Data
    @Builder
    public static class Basic {
        private String profilePictureUrl;
        private String name;
        private String jobPosition;
        private String email;
        private String mobile;
        private String company;
        private String department;
        private String manager;
        private String location;
    }

    @Data
    @Builder
    public static class Resume {
        private String resumeUrl;
        private String skills;
        private String certifications;
    }

    @Data
    @Builder
    public static class PrivateInfo {
        private LocalDate dateOfBirth;
        private String residingAddress;
        private String nationality;
        private String personalEmail;
        private Gender gender;
        private MaritalStatus maritalStatus;
        private LocalDate dateOfJoining;
    }

    @Data
    @Builder
    public static class SalaryInfo {
        private Double salary;
        private boolean readOnly;
    }

    @Data
    @Builder
    public static class BankDetails {
        private String accountNumber;
        private String bankName;
        private String ifscCode;
        private String panNumber;
        private String uanNumber;
        private String employeeCode;
    }

    @Data
    @Builder
    public static class Security {
        private boolean emailVerified;
        private String loginId;
    }
}
