package com.nexu.Plans.dto;

import com.nexu.Places.domain.Places;
import com.nexu.Plans.domain.VisibilityPlans;
import com.nexu.Users.domain.Users;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class PlansResponseDto {

    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdDate;
    private VisibilityPlans visibility;

    private Set<Long> usersId;
    private Set<Long> placesId;
    private Long creatorId;
}
