package com.nexu.PlacesToFun.application;

import com.nexu.PlacesToFun.domain.PlacesToFun;
import com.nexu.PlacesToFun.domain.PlacesToFunService;
import com.nexu.PlacesToFun.dto.PlacesToFunRequestDto;
import com.nexu.PlacesToFun.dto.PlacesToFunResponseDto;
import com.nexu.PlacesToFun.domain.enums.PlaceCategoryToFun;
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
@RequestMapping("/places-to-fun")
@RequiredArgsConstructor
public class PlacesToFunController {

    private final ModelMapper modelMapper;
    private final PlacesToFunService funService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<PlacesToFunResponseDto> createPlace(@Valid @RequestBody PlacesToFunRequestDto dto) {
        PlacesToFunResponseDto response = funService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasAnyRole('VIEWER')")
    @GetMapping("/{id}")
    public ResponseEntity<PlacesToFunResponseDto> getPlaceById(@PathVariable Long id) {
        return ResponseEntity.ok(funService.getPlaceById(id));
    }

    @PreAuthorize("hasAnyRole('VIEWER')")
    @GetMapping
    public ResponseEntity<List<PlacesToFunResponseDto>> getAllPlaces() {
        return ResponseEntity.ok(funService.getAllPlaces());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<PlacesToFunResponseDto> updatePlace(@PathVariable Long id, @Valid @RequestBody PlacesToFunRequestDto dto) {
        return ResponseEntity.ok(funService.updatePlace(id, dto));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {
        funService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('VIEWER')")
    @GetMapping("/search")
    public ResponseEntity<List<PlacesToFunResponseDto>> searchPlaces(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) PlaceCategoryToFun category,
            @RequestParam(required = false) Double minQualification,
            @RequestParam(required = false) Double maxQualification) {
        return ResponseEntity.ok(funService.searchPlaces(status, category, minQualification, maxQualification));
    }

    // 7. Agregar a favoritos
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("/{placeId}/favorite")
    public ResponseEntity<String> addFavorite(@PathVariable Long placeId, @RequestParam Long userId) {
        funService.addFavorite(userId, placeId);
        return ResponseEntity.ok("Place marked as favorite");
    }

    // 8. Eliminar de favoritos
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @DeleteMapping("/{placeId}/favorite")
    public ResponseEntity<String> removeFavorite(@PathVariable Long placeId, @RequestParam Long userId) {
        funService.removeFavorite(userId, placeId);
        return ResponseEntity.ok("Place taken from favorites");
    }

    // 9. Obtener favoritos por usuario
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<Set<PlacesToFunResponseDto>> getFavoritesByUser(@PathVariable Long userId) {
        Set<PlacesToFunResponseDto> list = funService.getFavoritesByUser(userId);
        return ResponseEntity.ok(list);
    }

    // 10. Abiertos ahora
    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'VIEWER')")
    @GetMapping("/open-actually")
    public ResponseEntity<List<PlacesToFunResponseDto>> abiertosAhora() {
        LocalTime ahora = LocalTime.now();
        List<PlacesToFun> abiertos = funService.buscarLugaresAbiertosA(ahora);
        List<PlacesToFunResponseDto> response = abiertos.stream()
                .map(p -> modelMapper.map(p, PlacesToFunResponseDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // 11. Turno noche
    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'VIEWER')")
    @GetMapping("/night-shift")
    public ResponseEntity<List<PlacesToFunResponseDto>> lugaresTurnoNoche() {
        List<PlacesToFun> turnoNoche = funService.buscarTurnoNoche();
        List<PlacesToFunResponseDto> response = turnoNoche.stream()
                .map(p -> modelMapper.map(p, PlacesToFunResponseDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
