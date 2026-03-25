package com.nexu.Reviews.domain;

import com.nexu.Pictures.domain.Pictures;
import com.nexu.Places.domain.Places;
import com.nexu.Places.infrastructure.DefaultPlacesRepository;
import com.nexu.Reviews.dto.ReviewRequestDto;
import com.nexu.Reviews.dto.ReviewResponseDto;
import com.nexu.Reviews.infrastructure.ReviewsRepository;
import com.nexu.Users.domain.Users;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.events.ReviewChangedEvent;
import com.nexu.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewsService {

    private final ReviewsRepository reviewsRepository;
    private final UsersRepository usersRepository;
    private final DefaultPlacesRepository placesRepository;
    private final ModelMapper modelMapper;
    private final ApplicationEventPublisher eventPublisher;

    private ReviewResponseDto mapToReviewResponseDto(Reviews review) {
        ReviewResponseDto dto = modelMapper.map(review, ReviewResponseDto.class);

        // Set manual de campos derivados
        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getId());
            dto.setUserName(review.getUser().getName());
        }

        if (review.getPlace() != null) {
            dto.setPlaceId(review.getPlace().getId());
            dto.setPlaceName(review.getPlace().getName());
        }

        Set<String> pictureUrls = review.getPictures() != null
                ? review.getPictures().stream()
                .map(Pictures::getUrl)
                .collect(Collectors.toSet())
                : Set.of();
        dto.setPictureUrls(pictureUrls);

        return dto;
    }

    public ReviewResponseDto createReview(ReviewRequestDto requestDto, Long creatorId, Long placeId) {
        Users creator = usersRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + creatorId));

        Places place = placesRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("Lugar no encontrado con ID: " + placeId));

        Reviews review = modelMapper.map(requestDto, Reviews.class);
        review.setUser(creator);
        review.setPlace(place);

        review = reviewsRepository.save(review);
        eventPublisher.publishEvent(new ReviewChangedEvent(this, place.getId()));

        return mapToReviewResponseDto(review);
    }

    public ReviewResponseDto getReviewById(Long id) {
        Reviews review = reviewsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña no encontrada con id " + id));

        return mapToReviewResponseDto(review);
    }

    public ReviewResponseDto updateReview(Long id, ReviewRequestDto requestDto, Long creatorId) {
        Users creator = usersRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + creatorId));

        Reviews review = reviewsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña no encontrada con id " + id));

        if (!review.getUser().getId().equals(creatorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para modificar esta reseña.");
        }

        review.setComment(requestDto.getComment());
        review.setRating(requestDto.getRating());

        if (requestDto.getPictures() != null) {
            review.getPictures().clear();
            review.getPictures().addAll(requestDto.getPictures());
        }

        review = reviewsRepository.save(review);
        eventPublisher.publishEvent(new ReviewChangedEvent(this, review.getPlace().getId()));

        return mapToReviewResponseDto(review);
    }

    public void deleteReview(Long id, Long creatorId) {
        Users creator = usersRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + creatorId));

        Reviews review = reviewsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña no encontrada con id " + id));

        if (!review.getUser().getId().equals(creatorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para eliminar esta reseña.");
        }

        Long placeId = review.getPlace().getId();
        reviewsRepository.deleteById(id);

        eventPublisher.publishEvent(new ReviewChangedEvent(this, placeId));
    }

    public List<ReviewResponseDto> getReviewsByUserId(Long userId) {
        List<Reviews> reviews = reviewsRepository.findByUserId(userId);
        return reviews.stream()
                .map(this::mapToReviewResponseDto)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDto> getReviewsByPlaceId(Long placeId) {
        List<Reviews> reviews = reviewsRepository.findByPlaceId(placeId);
        return reviews.stream()
                .map(this::mapToReviewResponseDto)
                .collect(Collectors.toList());
    }

    public ReviewResponseDto incrementLikes(Long id, Long creatorId) {
        usersRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + creatorId));

        Reviews review = reviewsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña no encontrada con ID: " + id));

        review.setLikes((review.getLikes() == 0 ? 1 : review.getLikes() + 1));
        review = reviewsRepository.save(review);

        return mapToReviewResponseDto(review);
    }
}
