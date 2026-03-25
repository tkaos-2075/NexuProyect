package com.nexu.Maps;

import com.nexu.Maps.dto.NearbyPlaceDTO;
import com.nexu.Maps.dto.RouteInfoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/maps")
public class GoogleMapsController {

    private final GoogleMapsService googleMapsService;

    public GoogleMapsController(GoogleMapsService googleMapsService) {
        this.googleMapsService = googleMapsService;
    }

    @PreAuthorize("hasRole('VIEWER')")
    @GetMapping("/route")
    public ResponseEntity<RouteInfoDTO> getRouteInfo(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam(defaultValue = "driving") String mode) throws Exception {
        return ResponseEntity.ok(googleMapsService.getRouteInfo(origin, destination, mode));
    }

    @PreAuthorize("hasRole('VIEWER')")
    @GetMapping("/search")
    public ResponseEntity<List<NearbyPlaceDTO>> searchRealPlaces(
            @RequestParam String query,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") int radius) throws Exception {
        return ResponseEntity.ok(googleMapsService.searchPlaces(query, lat, lng, radius));
    }

    @PreAuthorize("hasRole('VIEWER')")
    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyPlaceDTO>> getNearbyPlaces(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") int radius) throws Exception {
        return ResponseEntity.ok(googleMapsService.searchPlaces("", lat, lng, radius));
    }
}
