package com.nexu.PlacesToFun.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nexu.Places.domain.enums.Payment;
import com.nexu.PlacesToFun.domain.enums.PlaceCategoryToFun;
import com.nexu.PlacesToFun.domain.enums.SizePark;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class PlacesToFunResponseDto {

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

    // específicos de PlacesToFun
    private PlaceCategoryToFun placeCategoryToFun;
    private List<String> games;
    private Double priceFicha;
    private SizePark sizePark;
    private Boolean haveGames;
}
