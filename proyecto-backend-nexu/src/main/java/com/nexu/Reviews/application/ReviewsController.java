package com.nexu.Reviews.application;


import com.nexu.Reviews.domain.ReviewsService;
import com.nexu.Reviews.dto.ReviewRequestDto;
import com.nexu.Reviews.dto.ReviewResponseDto;
import com.nexu.Users.domain.Users;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewsController {

    private final ReviewsService reviewsService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping
    public ResponseEntity<Long> createReview(
            @RequestBody @Valid ReviewRequestDto requestDto,
            @RequestParam("placeId") Long placeId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();
        Long userId = user.getId();

        ReviewResponseDto createdReview = reviewsService.createReview(requestDto, userId, placeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview.getId());
    }


    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('VIEWER')")
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> getReviewById(@PathVariable Long id) {
        ReviewResponseDto review = reviewsService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateReview(@PathVariable Long id, @RequestBody @Valid ReviewRequestDto requestDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) auth.getPrincipal();
        Long userId = user.getId();
        reviewsService.updateReview(id, requestDto, userId);
        return ResponseEntity.ok().build(); // <- 200 OK sin body
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) auth.getPrincipal();
        Long userId = user.getId();

        reviewsService.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByUser(@PathVariable Long userId) {
        List<ReviewResponseDto> reviews = reviewsService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('VIEWER')")
    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByPlace(@PathVariable Long placeId) {
        List<ReviewResponseDto> reviews = reviewsService.getReviewsByPlaceId(placeId);
        return ResponseEntity.ok(reviews);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PatchMapping("/{id}/like")
    public ResponseEntity<Void> incrementLikes(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) auth.getPrincipal();
        Long userId = user.getId();
        reviewsService.incrementLikes(id, userId);
        return ResponseEntity.ok().build(); // Solo 200 OK, sin cuerpo
    }


}

