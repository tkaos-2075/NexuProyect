package com.nexu.Places.infrastructure;

import com.nexu.Places.domain.Places;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface PlacesRepository<T extends Places> extends JpaRepository<T, Long> {
}