package com.Dayflow.service;

import com.Dayflow.exception.ForbiddenException;
import com.Dayflow.model.Role;
import com.Dayflow.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeContextService {

    private final CurrentUserService currentUserService;

    public User requireEmployee() {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() != Role.EMPLOYEE) {
            throw new ForbiddenException("User does not have permission");
        }
        return user;
    }
}
