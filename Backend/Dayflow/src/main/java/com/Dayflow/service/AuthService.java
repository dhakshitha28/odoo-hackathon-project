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
import java.util.Locale;
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
    private final EmployeeStatusService employeeStatusService;

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (request.getRole() == Role.EMPLOYEE) {
            throw new BadRequestException("Employees cannot sign up. Please contact your HR/Admin.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new BadRequestException("Email already registered");
        }

        String employeeId = request.getEmployeeId().trim();
        if (userRepository.existsByEmployeeId(employeeId)) {
            throw new BadRequestException("Employee ID already exists");
        }

        CompanyLookup companyLookup = resolveOrCreateCompany(request.getCompanyName(), request.getLogoUrl());
        Company company = companyLookup.company();

        int yearOfJoining = LocalDateTime.now().getYear();

        String loginId = loginIdGeneratorService.generateLoginId(
            company,
            request.getFirstName(),
            request.getLastName(),
            yearOfJoining
        );

        User user = User.builder()
            .loginId(loginId)
            .employeeId(employeeId)
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail().trim())
            .password(passwordEncoder.encode(request.getPassword()))
            .phoneNumber(request.getPhoneNumber())
            .role(request.getRole())
            .emailVerified(false)
            .yearOfJoining(yearOfJoining)
            .company(company)
            .build();
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
            .joinedExistingCompany(companyLookup.existing())
            .build();
    }

    @Transactional(readOnly = true)
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
        boolean canCreateEmployee = user.getRole() == Role.ADMIN || user.getRole() == Role.HR;

        return AuthResponse.builder()
            .token(token)
            .loginId(user.getLoginId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .role(user.getRole())
            .companyName(user.getCompany().getName())
            .companyLogoUrl(user.getCompany().getLogoUrl())
            .profilePictureUrl(user.getProfilePictureUrl())
            .emailVerified(user.isEmailVerified())
            .canCreateEmployee(canCreateEmployee)
            .checkedIn(employeeStatusService.isCheckedIn(user.getId()))
            .redirectPath("/dashboard")
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

    private CompanyLookup resolveOrCreateCompany(String rawName, String logoUrl) {
        String name = rawName == null ? "" : rawName.trim().replaceAll("\\s+", " ");
        if (name.isBlank()) {
            throw new BadRequestException("Company name is required");
        }

        String code = toCompanyCode(name);
        Company existing = companyRepository.findByCode(code)
            .or(() -> companyRepository.findByNameIgnoreCase(name))
            .orElse(null);

        if (existing != null) {
            if (existing.getCode() == null || existing.getCode().isBlank()) {
                existing.setCode(code);
            }
            if ((existing.getLogoUrl() == null || existing.getLogoUrl().isBlank())
                && logoUrl != null && !logoUrl.isBlank()) {
                existing.setLogoUrl(logoUrl);
            }
            return new CompanyLookup(companyRepository.save(existing), true);
        }

        Company company = Company.builder()
            .name(name)
            .code(code)
            .logoUrl(logoUrl)
            .prefix(loginIdGeneratorService.generateCompanyPrefix(name))
            .build();
        return new CompanyLookup(companyRepository.save(company), false);
    }

    private String toCompanyCode(String name) {
        String code = name.toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-+|-+$", "");
        if (code.isBlank()) {
            throw new BadRequestException("Company name is invalid");
        }
        return code;
    }

    private record CompanyLookup(Company company, boolean existing) {
    }
}