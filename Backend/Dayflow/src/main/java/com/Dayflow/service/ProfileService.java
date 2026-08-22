package com.Dayflow.service;

import com.Dayflow.dto.request.UpdateProfileRequest;
import com.Dayflow.dto.response.ProfileResponse;
import com.Dayflow.exception.ResourceNotFoundException;
import com.Dayflow.model.Role;
import com.Dayflow.model.User;
import com.Dayflow.model.UserProfile;
import com.Dayflow.repository.UserProfileRepository;
import com.Dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile() {
        User user = getCurrentUser();
        UserProfile profile = getOrCreateProfile(user);
        return toResponse(user, profile);
    }

    @Transactional
    public ProfileResponse updateMyProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        UserProfile profile = getOrCreateProfile(user);

        if (request.getProfilePictureUrl() != null) {
            profile.setProfilePictureUrl(request.getProfilePictureUrl());
        }
        if (request.getDepartment() != null) {
            profile.setDepartment(request.getDepartment());
        }
        if (request.getManagerName() != null) {
            profile.setManagerName(request.getManagerName());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation());
        }
        if (request.getAbout() != null) {
            profile.setAbout(request.getAbout());
        }
        if (request.getJobLoves() != null) {
            profile.setJobLoves(request.getJobLoves());
        }
        if (request.getInterestsHobbies() != null) {
            profile.setInterestsHobbies(request.getInterestsHobbies());
        }
        if (request.getResumeText() != null) {
            profile.setResumeText(request.getResumeText());
        }
        if (request.getSkills() != null) {
            profile.setSkills(new ArrayList<>(request.getSkills()));
        }
        if (request.getCertifications() != null) {
            profile.setCertifications(new ArrayList<>(request.getCertifications()));
        }
        if (request.getMonthlyWage() != null) {
            profile.setMonthlyWage(request.getMonthlyWage());
        }

        userProfileRepository.save(profile);
        return toResponse(user, profile);
    }

    private User getCurrentUser() {
        String loginId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByLoginId(loginId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserProfile getOrCreateProfile(User user) {
        return userProfileRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                UserProfile profile = UserProfile.builder()
                    .user(user)
                    .department(defaultDepartment(user.getRole()))
                    .managerName("")
                    .location("")
                    .about("")
                    .jobLoves("")
                    .interestsHobbies("")
                    .resumeText("")
                    .skills(new ArrayList<>())
                    .certifications(new ArrayList<>())
                    .monthlyWage(50000.0)
                    .build();
                return userProfileRepository.save(profile);
            });
    }

    private String defaultDepartment(Role role) {
        return switch (role) {
            case ADMIN -> "Administration";
            case HR -> "HR";
            default -> "Operations";
        };
    }

    private ProfileResponse toResponse(User user, UserProfile profile) {
        return ProfileResponse.builder()
            .id(profile.getId())
            .loginId(user.getLoginId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phoneNumber(user.getPhoneNumber())
            .role(user.getRole())
            .companyName(user.getCompany().getName())
            .companyLogoUrl(user.getCompany().getLogoUrl())
            .profilePictureUrl(profile.getProfilePictureUrl())
            .department(profile.getDepartment())
            .managerName(profile.getManagerName())
            .location(profile.getLocation())
            .about(profile.getAbout())
            .jobLoves(profile.getJobLoves())
            .interestsHobbies(profile.getInterestsHobbies())
            .resumeText(profile.getResumeText())
            .skills(profile.getSkills())
            .certifications(profile.getCertifications())
            .monthlyWage(profile.getMonthlyWage())
            .build();
    }
}
