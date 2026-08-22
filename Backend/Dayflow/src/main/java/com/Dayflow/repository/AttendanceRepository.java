package com.Dayflow.repository;

import com.Dayflow.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findFirstByUserIdAndCheckOutTimeIsNullOrderByCheckInTimeDesc(Long userId);

    boolean existsByUserIdAndCheckOutTimeIsNull(Long userId);

    List<Attendance> findByUserIdAndCheckInTimeGreaterThanEqualAndCheckInTimeLessThanOrderByCheckInTimeAsc(
        Long userId,
        LocalDateTime start,
        LocalDateTime end
    );

    List<Attendance> findByUserIdOrderByCheckInTimeDesc(Long userId);

    @Query("""
        SELECT a FROM Attendance a
        JOIN a.user u
        WHERE u.company.id = :companyId
        AND a.checkInTime >= :start AND a.checkInTime < :end
        ORDER BY a.checkInTime ASC
        """)
    List<Attendance> findByCompanyAndDateRange(
        @Param("companyId") Long companyId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
}
