package com.Dayflow.repository;

import com.Dayflow.model.TimeOff;
import com.Dayflow.model.TimeOffStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TimeOffRepository extends JpaRepository<TimeOff, Long> {
    boolean existsByUserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Long userId,
        TimeOffStatus status,
        LocalDate startDate,
        LocalDate endDate
    );

    List<TimeOff> findByUserIdOrderByIdDesc(Long userId);

    @EntityGraph(attributePaths = {"user", "user.company"})
    List<TimeOff> findByUser_Company_IdOrderByIdDesc(Long companyId);

    long countByUserIdAndStatus(Long userId, TimeOffStatus status);

    @Query("""
        SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END
        FROM TimeOff t
        WHERE t.user.id = :userId
        AND t.status <> com.Dayflow.model.TimeOffStatus.REJECTED
        AND t.startDate <= :endDate
        AND t.endDate >= :startDate
        """)
    boolean existsOverlapping(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
