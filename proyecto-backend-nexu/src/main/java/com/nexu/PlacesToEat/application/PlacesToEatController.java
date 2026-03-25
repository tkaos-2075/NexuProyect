package com.nexu.PlacesToEat.application;

import com.nexu.PlacesToEat.domain.PlacesToEatService;
import com.nexu.PlacesToEat.dto.PlacesToEatRequestDto;
import com.nexu.PlacesToEat.dto.PlacesToEatResponseDto;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/places-to-eat")
@RequiredArgsConstructor
public class PlacesToEatController {

    private final PlacesToEatService eatService;
    private final ModelMapper modelMapper;

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<PlacesToEatResponseDto> createPlace(@Valid @RequestBody PlacesToEatRequestDto dto) {
        PlacesToEatResponseDto response = eatService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PreAuthorize("hasAnyRole('VIEWER')")
    @GetMapping("/{id}")
    public ResponseEntity<PlacesToEatResponseDto> getPlaceById(@PathVariable Long id) {
        return ResponseEntity.ok(eatService.getPlaceById(id));
    }

    @PreAuthorize("hasAnyRole('VIEWER')")
    @GetMapping
    public ResponseEntity<List<PlacesToEatResponseDto>> getAllPlaces() {
        return ResponseEntity.ok(eatService.getAllPlaces());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<PlacesToEatResponseDto> updatePlace(@PathVariable Long id, @Valid @RequestBody PlacesToEatRequestDto dto) {
        return ResponseEntity.ok(eatService.updatePlace(id, dto));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {
        eatService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('VIEWER')")
    @GetMapping("/search")
    public ResponseEntity<List<PlacesToEatResponseDto>> searchPlaces(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) PlaceCategoryToEat category,
            @RequestParam(required = false) Double minQualification,
            @RequestParam(required = false) Double maxQualification) {
        return ResponseEntity.ok(eatService.searchPlaces(status, category, minQualification, maxQualification));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/{placeId}/favorite")
    public ResponseEntity<String> addFavorite(@PathVariable Long placeId, @RequestParam Long userId) {
        eatService.addFavorite(userId, placeId);
        return ResponseEntity.ok("Place marked as favorite");
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/{placeId}/favorite")
    public ResponseEntity<String> removeFavorite(@PathVariable Long placeId, @RequestParam Long userId) {
        eatService.removeFavorite(userId, placeId);
        return ResponseEntity.ok("Place taken from favorites");
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<Set<PlacesToEatResponseDto>> getFavoritesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(eatService.getFavoritesByUser(userId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'VIEWER')")
    @GetMapping("/open-actually")
    public ResponseEntity<List<PlacesToEatResponseDto>> abiertosAhora() {
        LocalTime ahora = LocalTime.now();
        return ResponseEntity.ok(
                eatService.buscarLugaresAbiertosA(ahora).stream()
                        .map(p -> modelMapper.map(p, PlacesToEatResponseDto.class))
                        .collect(Collectors.toList())
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'VIEWER')")
    @GetMapping("/night-shift")
    public ResponseEntity<List<PlacesToEatResponseDto>> lugaresTurnoNoche() {
        return ResponseEntity.ok(
                eatService.buscarTurnoNoche().stream()
                        .map(p -> modelMapper.map(p, PlacesToEatResponseDto.class))
                        .collect(Collectors.toList())
        );
    }
}
