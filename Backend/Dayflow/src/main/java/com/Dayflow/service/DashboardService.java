package com.Dayflow.service;

import com.Dayflow.dto.response.CurrentUserResponse;
import com.Dayflow.dto.response.DashboardResponse;
import com.Dayflow.dto.response.EmployeeCardResponse;
import com.Dayflow.dto.response.EmployeeDetailResponse;
import com.Dayflow.exception.ResourceNotFoundException;
import com.Dayflow.model.User;
import com.Dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final EmployeeStatusService employeeStatusService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String search) {
        User currentUser = currentUserService.getCurrentUser();
        List<User> employees = userRepository.searchCompanyEmployees(
            currentUser.getCompany().getId(),
            search == null ? "" : search.trim()
        );

        return DashboardResponse.builder()
            .currentUser(toCurrentUser(currentUser))
            .employees(employees.stream().map(this::toCard).toList())
            .build();
    }

    @Transactional(readOnly = true)
    public EmployeeDetailResponse getEmployee(Long employeeId) {
        User currentUser = currentUserService.getCurrentUser();
        User employee = userRepository.findByIdAndCompanyId(employeeId, currentUser.getCompany().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return EmployeeDetailResponse.builder()
            .id(employee.getId())
            .employeeId(employee.getEmployeeId())
            .loginId(employee.getLoginId())
            .firstName(employee.getFirstName())
            .lastName(employee.getLastName())
            .email(employee.getEmail())
            .phoneNumber(employee.getPhoneNumber())
            .role(employee.getRole())
            .yearOfJoining(employee.getYearOfJoining())
            .profilePictureUrl(employee.getProfilePictureUrl())
            .companyName(employee.getCompany().getName())
            .status(employeeStatusService.resolveStatus(employee.getId()))
            .build();
    }

    private CurrentUserResponse toCurrentUser(User user) {
        return CurrentUserResponse.builder()
            .id(user.getId())
            .loginId(user.getLoginId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .role(user.getRole())
            .profilePictureUrl(user.getProfilePictureUrl())
            .companyName(user.getCompany().getName())
            .companyLogoUrl(user.getCompany().getLogoUrl())
            .checkedIn(employeeStatusService.isCheckedIn(user.getId()))
            .canCreateEmployee(currentUserService.canCreateEmployee(user))
            .build();
    }

    private EmployeeCardResponse toCard(User user) {
        return EmployeeCardResponse.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .profilePictureUrl(user.getProfilePictureUrl())
            .status(employeeStatusService.resolveStatus(user.getId()))
            .build();
    }
}
