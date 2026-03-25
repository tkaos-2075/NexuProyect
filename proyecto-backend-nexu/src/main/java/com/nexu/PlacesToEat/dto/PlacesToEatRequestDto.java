package com.nexu.PlacesToEat.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nexu.Places.domain.enums.Payment;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.domain.enums.TypeCoffee;
import com.nexu.PlacesToEat.domain.enums.TypeRestaurant;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PlacesToEatRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "La dirección es obligatoria")
    private String address;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @NotNull
    private Payment payment;

    @NotNull
    @JsonFormat(pattern = "HH:mm")
    private LocalTime openTime;

    @NotNull
    @JsonFormat(pattern = "HH:mm")
    private LocalTime closeTime;

    @NotBlank
    private String description;

    private Boolean wifi;

    private String priceRange;

    private Double estimatedPrice;

    @NotNull
    private Integer capacity;

    @NotBlank
    private String status;

    // específicos de PlacesToEat
    @NotNull
    private PlaceCategoryToEat placeCategoryToEat;
    private TypeRestaurant typeRestaurant;
    private Boolean delivery;
    private TypeCoffee typeCoffee;
    private String menu;
}
