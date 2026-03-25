package com.nexu.Labels.infrastructure;

import com.nexu.Labels.domain.Labels;
import com.nexu.Labels.domain.LabelsStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabelsRepository extends JpaRepository<Labels, Long> {
    boolean existsByName(String name);
    Optional<Labels> findByName(String name);
    List<Labels> findByStatus(LabelsStatus status);
    List<Labels> findByColor(String color);
}
