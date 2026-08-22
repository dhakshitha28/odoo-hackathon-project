package com.Dayflow.repository;

import com.Dayflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginId(String loginId);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByLoginId(String loginId);
    int countByCompanyIdAndYearOfJoining(Long companyId, int yearOfJoining);
}