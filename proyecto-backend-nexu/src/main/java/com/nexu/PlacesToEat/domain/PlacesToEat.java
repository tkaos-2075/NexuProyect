package com.nexu.PlacesToEat.domain;

import com.nexu.Places.domain.Places;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.domain.enums.TypeCoffee;
import com.nexu.PlacesToEat.domain.enums.TypeRestaurant;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "places_to_eat")
public class PlacesToEat extends Places {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlaceCategoryToEat placeCategoryToEat; //obs

    private String menu;

    //Attributes of Restaurant
    @Enumerated(EnumType.STRING)
    private TypeRestaurant typeRestaurant;
    private Boolean delivery;

    //Attributes of Coffee
    @Enumerated(EnumType.STRING)
    private TypeCoffee typeCoffee;
}
