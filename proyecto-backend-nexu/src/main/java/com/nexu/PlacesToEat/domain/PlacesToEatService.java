package com.nexu.PlacesToEat.domain;

import com.nexu.Labels.domain.Labels;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.dto.PlacesToEatRequestDto;
import com.nexu.PlacesToEat.dto.PlacesToEatResponseDto;
import com.nexu.PlacesToEat.infrastructure.PlacesToEatRepository;
import com.nexu.Users.domain.Users;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.exception.AccessDeniedException;
import com.nexu.exception.ResourceNotFoundException;
import com.nexu.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlacesToEatService {

    private final PlacesToEatRepository repository;
    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;
    private final AuthUtils authUtils;

    private PlacesToEatResponseDto mapToPlacesToEatResponseDto(PlacesToEat place) {
        PlacesToEatResponseDto dto = modelMapper.map(place, PlacesToEatResponseDto.class);

        if (place.getReviews() != null) {
            dto.setReviewIds(place.getReviews()
                    .stream()
                    .map(review -> review.getId())
                    .collect(Collectors.toSet()));
        }

        if (place.getLabels() != null) {
            dto.setLabelNames(place.getLabels()
                    .stream()
                    .map(Labels::getName)
                    .collect(Collectors.toList()));
        }

        if (place.getPictures() != null) {
            dto.setPictureUrls(place.getPictures()
                    .stream()
                    .map(picture -> picture.getUrl())
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public PlacesToEatResponseDto save(PlacesToEatRequestDto dto) {
        PlacesToEat entity = modelMapper.map(dto, PlacesToEat.class);
        Users authenticatedUser = authUtils.getAuthenticatedUser();
        entity.setCreator(authenticatedUser);

        PlacesToEat saved = repository.save(entity);
        return mapToPlacesToEatResponseDto(saved);
    }

    public PlacesToEatResponseDto getPlaceById(Long id) {
        PlacesToEat place = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + id + " no encontrado."));

        return mapToPlacesToEatResponseDto(place);
    }

    public List<PlacesToEatResponseDto> getAllPlaces() {
        return repository.findAll().stream()
                .map(this::mapToPlacesToEatResponseDto)
                .collect(Collectors.toList());
    }

    public PlacesToEatResponseDto updatePlace(Long id, PlacesToEatRequestDto dto) {
        PlacesToEat existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + id + " no encontrado."));

        Users authenticatedUser = authUtils.getAuthenticatedUser();

        if (!existing.getCreator().getId().equals(authenticatedUser.getId())) {
            throw new RuntimeException("No autorizado para actualizar este lugar.");
        }

        modelMapper.map(dto, existing);

        PlacesToEat updated = repository.save(existing);
        return mapToPlacesToEatResponseDto(updated);
    }

    public void deletePlace(Long id) {
        PlacesToEat existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + id + " no encontrado."));

        Users authenticatedUser = authUtils.getAuthenticatedUser();

        if (!existing.getCreator().getId().equals(authenticatedUser.getId())) {
            throw new AccessDeniedException("No autorizado para eliminar este lugar.");
        }

        repository.deleteById(id);
    }

    public List<PlacesToEatResponseDto> searchPlaces(String status, PlaceCategoryToEat category, Double min, Double max) {
        return repository.findAll().stream()
                .filter(p -> status == null || p.getStatus().name().equalsIgnoreCase(status))
                .filter(p -> category == null || p.getPlaceCategoryToEat().equals(category))
                .filter(p -> min == null || p.getQualification() >= min)
                .filter(p -> max == null || p.getQualification() <= max)
                .map(this::mapToPlacesToEatResponseDto)
                .collect(Collectors.toList());
    }

    public void addFavorite(Long userId, Long placeId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + userId + " no encontrado."));
        PlacesToEat place = repository.findById(placeId)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + placeId + " no encontrado."));

        user.getFavorites().add(place);
        usersRepository.save(user);
    }

    public void removeFavorite(Long userId, Long placeId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + userId + " no encontrado."));
        PlacesToEat place = repository.findById(placeId)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + placeId + " no encontrado."));
        user.getFavorites().remove(place);
        usersRepository.save(user);
    }

    public Set<PlacesToEatResponseDto> getFavoritesByUser(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + userId + " no encontrado."));
        return user.getFavorites().stream()
                .filter(p -> p instanceof PlacesToEat)
                .map(p -> (PlacesToEat) p)
                .map(p -> modelMapper.map(p, PlacesToEatResponseDto.class))
                .collect(Collectors.toSet());
    }

    public List<PlacesToEat> buscarLugaresAbiertosA(LocalTime hora) {
        return repository.findByOpenTimeBeforeAndCloseTimeAfter(hora, hora);
    }

    public List<PlacesToEat> buscarTurnoNoche() {
        LocalTime cincoPM = LocalTime.of(17, 0);
        LocalTime medianoche = LocalTime.of(0, 0);
        return repository.findAll().stream()
                .filter(p -> p.getOpenTime().isAfter(cincoPM) && p.getCloseTime().isBefore(medianoche))
                .collect(Collectors.toList());
    }
}
