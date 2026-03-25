package com.nexu.Pictures.domain;

import com.nexu.Pictures.infrastructure.PicturesRepository;
import com.nexu.Places.domain.Places;
import com.nexu.Places.infrastructure.DefaultPlacesRepository;
import com.nexu.Reviews.domain.Reviews;
import com.nexu.Reviews.infrastructure.ReviewsRepository;
import com.nexu.events.PictureUploadEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PicturesService {

    private final DefaultPlacesRepository placesRepository;  // Repositorio para la clase base
    private final ReviewsRepository reviewsRepository;
    private final PicturesRepository picturesRepository;
    private final ApplicationEventPublisher eventPublisher;

    public void handlePictureUploadForPlace(List<MultipartFile> files, Long placeId) {
        Places place = placesRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("Place not found with id " + placeId));
        uploadPicturesForPlace(files, place);
    }

    private void uploadPicturesForPlace(List<MultipartFile> files, Places place) {
        for (MultipartFile file : files) {
            Pictures picture = new Pictures();
            picture.setPlace(place);
            Pictures savedPicture = picturesRepository.save(picture);
            eventPublisher.publishEvent(new PictureUploadEvent(savedPicture, file));
        }
    }

    public void handlePictureUploadForReview(List<MultipartFile> files, Long reviewId) {
        Reviews review = reviewsRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id " + reviewId));
        uploadPicturesForReview(files, review);
    }

    private void uploadPicturesForReview(List<MultipartFile> files, Reviews review) {
        for (MultipartFile file : files) {
            Pictures picture = new Pictures();
            picture.setReview(review);
            Pictures savedPicture = picturesRepository.save(picture);
            eventPublisher.publishEvent(new PictureUploadEvent(savedPicture, file));
        }
    }

    public List<String> getPictureUrlsByPlaceId(Long placeId) {
        return picturesRepository.findByPlaceId_Id(placeId)
                .stream()
                .map(Pictures::getUrl)
                .toList();
    }

    public List<String> getPictureUrlsByReviewId(Long reviewId) {
        return picturesRepository.findByReview_Id(reviewId)
                .stream()
                .map(Pictures::getUrl)
                .toList();
    }
}
