package com.nexu.PlacesToFun.domain;

import com.nexu.Places.domain.Places;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToFun.domain.enums.PlaceCategoryToFun;
import com.nexu.PlacesToFun.domain.enums.SizePark;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "places_to_fun")
public class PlacesToFun extends Places {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlaceCategoryToFun placeCategoryToFun; //obs

    //Attributes of Games
    @ElementCollection
    private List<String> games;
    private double priceFicha;

    //Attributes of Parks
    @Enumerated(EnumType.STRING)
    private SizePark sizePark;
    private Boolean haveGames;

}
