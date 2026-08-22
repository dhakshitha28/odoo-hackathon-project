package com.Dayflow.controller;

import com.Dayflow.dto.request.LoginRequest;
import com.Dayflow.dto.request.SignupRequest;
import com.Dayflow.dto.response.ApiResponse;
import com.Dayflow.dto.response.AuthResponse;
import com.Dayflow.dto.response.SignupResponse;
import com.Dayflow.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@Valid @RequestBody SignupRequest request) {
        SignupResponse response = authService.signup(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<SignupResponse>builder()
                .success(true)
                .message("Signup successful. Please verify your email before login.")
                .data(response)
                .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
            ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build()
        );
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam String token) {
        String message = authService.verifyEmail(token);

        return ResponseEntity.ok(
            ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .build()
        );
    }
}