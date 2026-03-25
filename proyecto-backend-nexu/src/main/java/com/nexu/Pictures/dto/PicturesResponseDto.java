package com.nexu.Pictures.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PicturesResponseDto {
    private Long id;
    private String url;
    private String s3Key;
    private LocalDateTime takenAt;
    private Long userId;
    private Long placeId;
    private Long reviewId;
}

