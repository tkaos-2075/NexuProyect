package com.nexu.Pictures.infrastructure;

import com.nexu.Pictures.domain.Pictures;
import com.nexu.Places.domain.Places;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PicturesRepository extends JpaRepository<Pictures, Long> {
    List<Pictures> findByPlaceId_Id(Long placeId);
    List<Pictures> findByReview_Id(Long reviewId);

}
