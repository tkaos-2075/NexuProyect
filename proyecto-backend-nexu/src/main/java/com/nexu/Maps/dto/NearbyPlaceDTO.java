package com.nexu.Maps.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class NearbyPlaceDTO {
    private String name;
    private String address;
    private double lat;
    private double lng;
}
