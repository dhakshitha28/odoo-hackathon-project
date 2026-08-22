package com.Dayflow.service;

import com.Dayflow.exception.ResourceNotFoundException;
import com.Dayflow.model.Role;
import com.Dayflow.model.User;
import com.Dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String loginId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByLoginId(loginId)
            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    public boolean canCreateEmployee(User user) {
        return user.getRole() == Role.ADMIN || user.getRole() == Role.HR;
    }

    public String dashboardPath() {
        return "/dashboard";
    }
}
