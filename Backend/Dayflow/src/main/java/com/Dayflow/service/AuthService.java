package com.Dayflow.service;

import com.Dayflow.dto.request.LoginRequest;
import com.Dayflow.dto.request.SignupRequest;
import com.Dayflow.dto.response.AuthResponse;
import com.Dayflow.dto.response.SignupResponse;
import com.Dayflow.exception.BadRequestException;
import com.Dayflow.exception.ResourceNotFoundException;
import com.Dayflow.model.*;
import com.Dayflow.repository.CompanyRepository;
import com.Dayflow.repository.EmailVerificationTokenRepository;
import com.Dayflow.repository.UserRepository;
import com.Dayflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final EmailVerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginIdGeneratorService loginIdGeneratorService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (request.getRole() == Role.EMPLOYEE) {
            throw new BadRequestException("Employees cannot sign up. Please contact your HR/Admin.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        if (companyRepository.existsByName(request.getCompanyName())) {
            throw new BadRequestException("Company name already exists");
        }

        String companyPrefix = loginIdGeneratorService.generateCompanyPrefix(request.getCompanyName());

        Company company = Company.builder()
            .name(request.getCompanyName())
            .logoUrl(request.getLogoUrl())
            .prefix(companyPrefix)
            .build();
        companyRepository.save(company);

        int yearOfJoining = LocalDateTime.now().getYear();

        User user = User.builder()
            .employeeId(request.getEmployeeId())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .phoneNumber(request.getPhoneNumber())
            .role(request.getRole())
            .emailVerified(false)
            .yearOfJoining(yearOfJoining)
            .company(company)
            .build();
        userRepository.save(user);

        String loginId = loginIdGeneratorService.generateLoginId(
            company,
            request.getFirstName(),
            request.getLastName(),
            yearOfJoining
        );
        user.setLoginId(loginId);
        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
            .token(token)
            .user(user)
            .expiryDate(LocalDateTime.now().plusHours(24))
            .build();
        tokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user, token);

        return SignupResponse.builder()
            .loginId(loginId)
            .email(user.getEmail())
            .role(user.getRole())
            .companyName(company.getName())
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByLoginId(request.getLoginId())
            .orElseThrow(() -> new ResourceNotFoundException("Invalid Login ID or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid Login ID or password");
        }

        if (!user.isEmailVerified()) {
            throw new BadRequestException("Please verify your email before logging in");
        }

        String token = jwtUtil.generateToken(user.getLoginId(), user.getRole().name());

        return AuthResponse.builder()
            .token(token)
            .loginId(user.getLoginId())
            .email(user.getEmail())
            .role(user.getRole())
            .companyName(user.getCompany().getName())
            .emailVerified(user.isEmailVerified())
            .build();
    }

    @Transactional
    public String verifyEmail(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
            .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);

        return "Email verified successfully. You can now login with Login ID: " + user.getLoginId();
    }
}