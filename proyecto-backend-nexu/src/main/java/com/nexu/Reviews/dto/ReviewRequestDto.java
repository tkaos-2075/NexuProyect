package com.nexu.Reviews.dto;

import com.nexu.Places.domain.Places;
import com.nexu.Users.domain.Users;
import com.nexu.Pictures.domain.Pictures;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class ReviewRequestDto {

    @NotBlank(message = "El comentario no puede estar vacío")
    private String comment;

    @Min(value = 1, message = "La calificación mínima es 1")
    @Max(value = 5, message = "La calificación máxima es 5")
    private int rating;

    private Set<Pictures> pictures;
}
