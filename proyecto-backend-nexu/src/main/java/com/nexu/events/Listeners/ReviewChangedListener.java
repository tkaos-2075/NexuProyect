package com.nexu.events.Listeners;

import com.nexu.Places.infrastructure.DefaultPlacesRepository;
import com.nexu.Reviews.domain.Reviews;
import com.nexu.Reviews.infrastructure.ReviewsRepository;
import com.nexu.events.ReviewChangedEvent;
import com.nexu.exception.InternalServerErrorException;
import com.nexu.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewChangedListener {

    private final DefaultPlacesRepository placesRepository;
    private final ReviewsRepository reviewsRepository;

    @Async
    @EventListener
    public void handleReviewChanged(ReviewChangedEvent event) {
        Long placeId = event.getPlaceId();

        try {
            double avgRating = reviewsRepository.findByPlaceId(placeId).stream()
                    .mapToDouble(Reviews::getRating)
                    .average()
                    .orElse(0.0);

            placesRepository.findById(placeId).ifPresentOrElse(place -> {
                place.setQualification(avgRating);
                placesRepository.save(place);
            }, () -> {
                throw new ResourceNotFoundException("No se encontró el lugar con ID: " + placeId);
            });

        } catch (Exception ignored){}
    }
}
