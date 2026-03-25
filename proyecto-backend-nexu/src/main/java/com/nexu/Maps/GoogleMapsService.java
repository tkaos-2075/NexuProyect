package com.nexu.Maps;

import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.model.*;
import com.nexu.Maps.dto.NearbyPlaceDTO;
import com.nexu.Maps.dto.RouteInfoDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GoogleMapsService {

    private final GeoApiContext context;

    public GoogleMapsService(GeoApiContext context) {
        this.context = context;
    }

    public RouteInfoDTO getRouteInfo(String origin, String destination, String mode) throws Exception {
        TravelMode travelMode = TravelMode.valueOf(mode.toUpperCase());
        DirectionsResult result = DirectionsApi.newRequest(context)
                .origin(origin)
                .destination(destination)
                .mode(travelMode)
                .await();

        if (result.routes.length == 0) {
            throw new RuntimeException("No route found.");
        }

        DirectionsRoute route = result.routes[0];
        DirectionsLeg leg = route.legs[0];

        return new RouteInfoDTO(
                leg.distance.humanReadable,
                leg.duration.humanReadable,
                route.overviewPolyline.getEncodedPath()
        );
    }

    public List<NearbyPlaceDTO> searchPlaces(String query, double lat, double lng, int radius) throws Exception {
        PlacesSearchResponse response;

        if (query == null || query.isBlank()) {
            response = PlacesApi.nearbySearchQuery(context, new LatLng(lat, lng))
                    .radius(radius)
                    .await();
        } else {
            response = PlacesApi.textSearchQuery(context, query)
                    .location(new LatLng(lat, lng))
                    .radius(radius)
                    .await();
        }

        List<NearbyPlaceDTO> results = new ArrayList<>();
        for (PlacesSearchResult r : response.results) {
            results.add(new NearbyPlaceDTO(
                    r.name,
                    r.formattedAddress != null ? r.formattedAddress : "",
                    r.geometry.location.lat,
                    r.geometry.location.lng
            ));
        }
        return results;
    }
}
