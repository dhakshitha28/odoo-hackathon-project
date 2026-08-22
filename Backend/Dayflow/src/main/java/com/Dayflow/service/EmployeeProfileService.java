package com.Dayflow.service;

import com.Dayflow.dto.request.UpdateEmployeeProfileRequest;
import com.Dayflow.dto.response.EmployeeProfileCardResponse;
import com.Dayflow.dto.response.EmployeeProfileResponse;
import com.Dayflow.model.User;
import com.Dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeProfileService {

    private final EmployeeContextService employeeContextService;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public EmployeeProfileResponse getProfile() {
        return toProfile(employeeContextService.requireEmployee());
    }

    @Transactional
    public EmployeeProfileResponse updateProfile(UpdateEmployeeProfileRequest request) {
        User employee = employeeContextService.requireEmployee();

        if (request.getAddress() != null) {
            employee.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            employee.setCity(request.getCity());
        }
        if (request.getState() != null) {
            employee.setState(request.getState());
        }
        if (request.getCountry() != null) {
            employee.setCountry(request.getCountry());
        }
        if (request.getPinCode() != null) {
            employee.setPinCode(request.getPinCode());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            employee.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getProfilePictureUrl() != null) {
            employee.setProfilePictureUrl(request.getProfilePictureUrl());
        }

        userRepository.save(employee);
        return toProfile(employee);
    }

    public EmployeeProfileCardResponse toProfileCard(User employee) {
        return EmployeeProfileCardResponse.builder()
            .profilePictureUrl(employee.getProfilePictureUrl())
            .name(fullName(employee))
            .employeeId(employee.getEmployeeId())
            .jobPosition(employee.getJobPosition())
            .department(employee.getDepartment())
            .email(employee.getEmail())
            .mobile(employee.getPhoneNumber())
            .company(employee.getCompany().getName())
            .manager(managerName(employee))
            .location(location(employee))
            .build();
    }

    public EmployeeProfileResponse toProfile(User employee) {
        List<EmployeeProfileResponse.Document> documents = new ArrayList<>();
        if (employee.getResumeUrl() != null && !employee.getResumeUrl().isBlank()) {
            documents.add(EmployeeProfileResponse.Document.builder()
                .name("Resume")
                .url(employee.getResumeUrl())
                .build());
        }

        return EmployeeProfileResponse.builder()
            .basic(EmployeeProfileResponse.Basic.builder()
                .profilePictureUrl(employee.getProfilePictureUrl())
                .name(fullName(employee))
                .employeeId(employee.getEmployeeId())
                .jobPosition(employee.getJobPosition())
                .email(employee.getEmail())
                .mobile(employee.getPhoneNumber())
                .company(employee.getCompany().getName())
                .department(employee.getDepartment())
                .manager(managerName(employee))
                .location(location(employee))
                .build())
            .resume(EmployeeProfileResponse.Resume.builder()
                .resumeUrl(employee.getResumeUrl())
                .skills(employee.getSkills())
                .certifications(employee.getCertifications())
                .build())
            .privateInfo(EmployeeProfileResponse.PrivateInfo.builder()
                .dateOfBirth(employee.getDateOfBirth())
                .residingAddress(residingAddress(employee))
                .nationality(employee.getNationality())
                .personalEmail(employee.getPersonalEmail())
                .gender(employee.getGender())
                .maritalStatus(employee.getMaritalStatus())
                .dateOfJoining(employee.getDateOfJoining())
                .build())
            .salaryInfo(EmployeeProfileResponse.SalaryInfo.builder()
                .salary(employee.getSalary())
                .basicSalary(employee.getBasicSalary())
                .allowances(employee.getAllowances())
                .bonus(employee.getBonus())
                .deductions(employee.getDeductions())
                .readOnly(true)
                .build())
            .bankDetails(EmployeeProfileResponse.BankDetails.builder()
                .accountNumber(employee.getAccountNumber())
                .bankName(employee.getBankName())
                .ifscCode(employee.getIfscCode())
                .panNumber(employee.getPanNumber())
                .uanNumber(employee.getUanNumber())
                .employeeCode(employee.getEmployeeId())
                .build())
            .documents(documents)
            .security(EmployeeProfileResponse.Security.builder()
                .emailVerified(employee.isEmailVerified())
                .loginId(employee.getLoginId())
                .build())
            .build();
    }

    public String fullName(User user) {
        return user.getFirstName() + " " + user.getLastName();
    }

    public String managerName(User user) {
        if (user.getManager() == null) {
            return null;
        }
        return fullName(user.getManager());
    }

    public String location(User user) {
        return joinNonBlank(user.getCity(), user.getState(), user.getCountry());
    }

    private String residingAddress(User user) {
        return joinNonBlank(user.getAddress(), user.getCity(), user.getState(), user.getCountry(), user.getPinCode());
    }

    private String joinNonBlank(String... parts) {
        String result = Arrays.stream(parts)
            .filter(part -> part != null && !part.isBlank())
            .collect(Collectors.joining(", "));
        return result.isBlank() ? null : result;
    }
}
