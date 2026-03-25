package com.nexu.Labels.dto;

import com.nexu.Labels.domain.LabelsStatus;
import lombok.Data;

import java.util.Set;

@Data
public class LabelsResponseDto {
    private Long id;
    private String name;
    private String description;
    private String color;
    private LabelsStatus status;

    private Set<Long> placeIds;
}
