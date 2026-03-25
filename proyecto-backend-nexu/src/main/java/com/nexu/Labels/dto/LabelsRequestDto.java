package com.nexu.Labels.dto;

import com.nexu.Labels.domain.LabelsStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LabelsRequestDto {
    @NotBlank(message = "Nombre es requerido")
    private String name;

    private String description;

    @NotBlank(message = "Color es requerido")
    private String color;

    private LabelsStatus status;
}
