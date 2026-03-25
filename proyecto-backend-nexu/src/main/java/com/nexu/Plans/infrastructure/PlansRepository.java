package com.nexu.Plans.infrastructure;

import com.nexu.Plans.domain.Plans;
import com.nexu.Plans.domain.VisibilityPlans;
import com.nexu.Users.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlansRepository extends JpaRepository<Plans, Long> {
    boolean existsByName(String name);
    List<Plans> findByVisibility(VisibilityPlans visibility);
    List<Plans> findByCreator(Users creator);
    List<Plans> findByStartDateGreaterThanEqualAndEndDateLessThanEqual(LocalDate startDate, LocalDate endDate);
}
