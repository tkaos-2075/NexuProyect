package com.nexu.Places.infrastructure;

import com.nexu.Places.domain.Places;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DefaultPlacesRepository extends JpaRepository<Places, Long> {
}
