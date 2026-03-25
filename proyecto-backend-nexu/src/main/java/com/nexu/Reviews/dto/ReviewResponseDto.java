package com.nexu.Reviews.dto;

import com.nexu.Places.domain.Places;
import com.nexu.Users.domain.Users;
import com.nexu.Pictures.domain.Pictures;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ReviewResponseDto {

    private Long id;
    private String comment;
    private int rating;
    private int likes;
    private LocalDateTime createdAt;

    // Evitamos el ciclo devolviendo solo campos simples o DTOs
    private String userName;
    private Long userId;

    private String placeName;
    private Long placeId;

    private Set<String> pictureUrls; // Asumimos que solo necesitas la URL
}
