package com.Dayflow.service;

import com.Dayflow.dto.request.CreateEmployeeRequest;
import com.Dayflow.dto.response.CreateEmployeeResponse;
import com.Dayflow.exception.ConflictException;
import com.Dayflow.exception.ForbiddenException;
import com.Dayflow.exception.ResourceNotFoundException;
import com.Dayflow.model.Role;
import com.Dayflow.model.User;
import com.Dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private static final String PASSWORD_CHARS =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$!%*?&";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final LoginIdGeneratorService loginIdGeneratorService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public CreateEmployeeResponse createEmployee(CreateEmployeeRequest request) {
        User creator = currentUserService.getCurrentUser();

        if (!currentUserService.canCreateEmployee(creator)) {
            throw new ForbiddenException("User does not have permission");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Employee with this email already exists.");
        }

        User manager = null;
        if (request.getManagerId() != null) {
            manager = userRepository
                .findByIdAndCompanyId(request.getManagerId(), creator.getCompany().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        }

        int yearOfJoining = request.getDateOfJoining().getYear();
        String employeeId = generateUniqueEmployeeId(
            creator,
            request.getFirstName(),
            request.getLastName(),
            yearOfJoining
        );

        String temporaryPassword = generateTemporaryPassword();

        User employee = User.builder()
            .loginId(employeeId)
            .employeeId(employeeId)
            .firstName(request.getFirstName().trim())
            .lastName(request.getLastName().trim())
            .email(request.getEmail().trim())
            .password(passwordEncoder.encode(temporaryPassword))
            .phoneNumber(request.getPhoneNumber())
            .role(Role.EMPLOYEE)
            .emailVerified(true)
            .yearOfJoining(yearOfJoining)
            .profilePictureUrl(request.getProfilePictureUrl())
            .dateOfBirth(request.getDateOfBirth())
            .gender(request.getGender())
            .department(request.getDepartment().trim())
            .jobPosition(request.getJobPosition().trim())
            .manager(manager)
            .dateOfJoining(request.getDateOfJoining())
            .employmentType(request.getEmploymentType())
            .address(request.getAddress())
            .city(request.getCity())
            .state(request.getState())
            .country(request.getCountry())
            .pinCode(request.getPinCode())
            .skills(request.getSkills())
            .certifications(request.getCertifications())
            .resumeUrl(request.getResumeUrl())
            .paidTimeOffBalance(24.0)
            .sickLeaveBalance(7.0)
            .company(creator.getCompany())
            .build();

        userRepository.save(employee);
        emailService.sendEmployeeCredentials(employee, temporaryPassword);

        return CreateEmployeeResponse.builder()
            .employeeId(employee.getEmployeeId())
            .name(employee.getFirstName() + " " + employee.getLastName())
            .email(employee.getEmail())
            .department(employee.getDepartment())
            .jobPosition(employee.getJobPosition())
            .dateOfJoining(employee.getDateOfJoining())
            .role(employee.getRole())
            .companyName(employee.getCompany().getName())
            .build();
    }

    private String generateUniqueEmployeeId(User creator, String firstName, String lastName, int yearOfJoining) {
        String employeeId = loginIdGeneratorService.generateLoginId(
            creator.getCompany(),
            firstName,
            lastName,
            yearOfJoining
        );

        int serial = userRepository.countByCompanyIdAndYearOfJoining(creator.getCompany().getId(), yearOfJoining) + 1;
        while (userRepository.existsByLoginId(employeeId) || userRepository.existsByEmployeeId(employeeId)) {
            serial++;
            employeeId = creator.getCompany().getPrefix()
                + loginIdGeneratorService.generateNameCode(firstName, lastName)
                + yearOfJoining
                + String.format("%04d", serial);
        }

        return employeeId;
    }

    private String generateTemporaryPassword() {
        StringBuilder password = new StringBuilder("Df1!");
        for (int i = 0; i < 8; i++) {
            password.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
        }
        return password.toString();
    }
}
