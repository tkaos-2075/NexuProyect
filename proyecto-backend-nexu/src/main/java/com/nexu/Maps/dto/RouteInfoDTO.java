package com.nexu.Maps.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class RouteInfoDTO {
    private String distance;
    private String duration;
    private String polyline;
}
