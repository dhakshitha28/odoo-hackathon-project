package com.Dayflow.repository;

import com.Dayflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginId(String loginId);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByLoginId(String loginId);
    boolean existsByEmployeeId(String employeeId);
    int countByCompanyIdAndYearOfJoining(Long companyId, int yearOfJoining);
    Optional<User> findByIdAndCompanyId(Long id, Long companyId);

    @Query("""
        SELECT u FROM User u
        WHERE u.company.id = :companyId
        AND (
            :search IS NULL OR :search = ''
            OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.employeeId) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.loginId) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        ORDER BY u.firstName ASC, u.lastName ASC
        """)
    List<User> searchCompanyEmployees(@Param("companyId") Long companyId, @Param("search") String search);
}
