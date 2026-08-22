package com.Dayflow.controller;

import com.Dayflow.dto.request.UpdateProfileRequest;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.ProfileResponse;
import com.Dayflow.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile() {
        ProfileResponse profile = profileService.getMyProfile();
        return ResponseEntity.ok(
            ApiResponse.<ProfileResponse>builder()
                .success(true)
                .message("Profile fetched successfully")
                .data(profile)
                .build()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateMyProfile(
        @Valid @RequestBody UpdateProfileRequest request
    ) {
        ProfileResponse profile = profileService.updateMyProfile(request);
        return ResponseEntity.ok(
            ApiResponse.<ProfileResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(profile)
                .build()
        );
    }
}
