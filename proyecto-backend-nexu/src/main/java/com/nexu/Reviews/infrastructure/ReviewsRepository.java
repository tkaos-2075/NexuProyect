package com.nexu.Reviews.infrastructure;

import com.nexu.Reviews.domain.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, Long> {

    List<Reviews> findByPlaceId(Long placeId);

    List<Reviews> findByUserId(Long userId);
}
