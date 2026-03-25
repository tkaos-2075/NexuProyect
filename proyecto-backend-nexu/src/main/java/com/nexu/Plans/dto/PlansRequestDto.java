package com.nexu.Plans.dto;

import com.nexu.Places.domain.Places;
import com.nexu.Plans.domain.VisibilityPlans;
import com.nexu.Users.domain.Users;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class PlansRequestDto {

    @NotBlank(message = "El nombre del plan no puede estar vacío")
    private String name;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private VisibilityPlans visibility;

    private Set<Long> usersId;

    private Set<Long> placesId;
}
