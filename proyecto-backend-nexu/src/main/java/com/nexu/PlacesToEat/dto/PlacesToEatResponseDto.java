package com.nexu.PlacesToEat.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nexu.Places.domain.enums.Payment;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.domain.enums.TypeCoffee;
import com.nexu.PlacesToEat.domain.enums.TypeRestaurant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class PlacesToEatResponseDto {

    private Long id;

    private String name;
    private String address;
    private Double latitude;
    private Double longitude;

    private Payment payment;
    private Boolean wifi;
    private Double qualification;
    private String description;
    private String priceRange;
    private Double estimatedPrice;
    private Integer capacity;

    private String status;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime openTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime closeTime;

    private List<String> labelNames;
    private Set<Long> reviewIds;
    private List<String> pictureUrls;

    // específicos de PlacesToEat
    private PlaceCategoryToEat placeCategoryToEat;
    private TypeRestaurant typeRestaurant;
    private Boolean delivery;
    private TypeCoffee typeCoffee;
    private String menu;

}
