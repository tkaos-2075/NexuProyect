package com.nexu.PlacesToFun.domain;

import com.nexu.Labels.domain.Labels;
import com.nexu.PlacesToFun.domain.enums.PlaceCategoryToFun;
import com.nexu.PlacesToFun.dto.PlacesToFunRequestDto;
import com.nexu.PlacesToFun.dto.PlacesToFunResponseDto;
import com.nexu.PlacesToFun.infrastructure.PlacesToFunRepository;
import com.nexu.Users.domain.Users;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.exception.AccessDeniedException;
import com.nexu.exception.ResourceNotFoundException;
import com.nexu.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlacesToFunService {

    private final PlacesToFunRepository repository;
    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;
    private final AuthUtils authUtils;

    private PlacesToFunResponseDto mapToPlacesToFunResponseDto(PlacesToFun place) {
        PlacesToFunResponseDto dto = modelMapper.map(place, PlacesToFunResponseDto.class);

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

    public PlacesToFunResponseDto save(PlacesToFunRequestDto dto) {
        PlacesToFun entity = modelMapper.map(dto, PlacesToFun.class);

        Users authenticatedUser = authUtils.getAuthenticatedUser();
        entity.setCreator(authenticatedUser);

        PlacesToFun saved = repository.save(entity);
        return mapToPlacesToFunResponseDto(saved);
    }

    public PlacesToFunResponseDto getPlaceById(Long id) {
        PlacesToFun place = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + id + " no encontrado."));

        return mapToPlacesToFunResponseDto(place);
    }

    public List<PlacesToFunResponseDto> getAllPlaces() {
        return repository.findAll().stream()
                .map(this::mapToPlacesToFunResponseDto)
                .collect(Collectors.toList());
    }

    public PlacesToFunResponseDto updatePlace(Long id, PlacesToFunRequestDto dto) {
        PlacesToFun existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + id + " no encontrado."));

        Users authenticatedUser = authUtils.getAuthenticatedUser();

        if (!existing.getCreator().getId().equals(authenticatedUser.getId())) {
            throw new AccessDeniedException("No autorizado para actualizar este lugar.");
        }

        modelMapper.map(dto, existing);

        PlacesToFun updated = repository.save(existing);
        return mapToPlacesToFunResponseDto(updated);
    }

    public void deletePlace(Long id) {
        PlacesToFun existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + id + " no encontrado."));

        Users authenticatedUser = authUtils.getAuthenticatedUser();

        if (!existing.getCreator().getId().equals(authenticatedUser.getId())) {
            throw new AccessDeniedException("No autorizado para eliminar este lugar.");
        }

        repository.deleteById(id);
    }

    public List<PlacesToFunResponseDto> searchPlaces(String status, PlaceCategoryToFun category, Double min, Double max) {
        return repository.findAll().stream()
                .filter(p -> status == null || p.getStatus().name().equalsIgnoreCase(status))
                .filter(p -> category == null || p.getPlaceCategoryToFun().equals(category))
                .filter(p -> min == null || p.getQualification() >= min)
                .filter(p -> max == null || p.getQualification() <= max)
                .map(this::mapToPlacesToFunResponseDto)
                .collect(Collectors.toList());
    }

    public void addFavorite(Long userId, Long placeId) {
        Users user = usersRepository.findById(userId).orElseThrow();
        PlacesToFun place = repository.findById(placeId)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + placeId + " no encontrado."));

        user.getFavorites().add(place);
        usersRepository.save(user);
    }

    public void removeFavorite(Long userId, Long placeId) {
        Users user = usersRepository.findById(userId).orElseThrow();
        PlacesToFun place = repository.findById(placeId)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar con ID " + placeId + " no encontrado."));

        user.getFavorites().remove(place);
        usersRepository.save(user);
    }

    public Set<PlacesToFunResponseDto> getFavoritesByUser(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow();
        return user.getFavorites().stream()
                .filter(p -> p instanceof PlacesToFun)
                .map(p -> (PlacesToFun) p)
                .map(p -> modelMapper.map(p, PlacesToFunResponseDto.class))
                .collect(Collectors.toSet());
    }

    public List<PlacesToFun> buscarLugaresAbiertosA(LocalTime hora) {
        return repository.findByOpenTimeBeforeAndCloseTimeAfter(hora, hora);
    }

    public List<PlacesToFun> buscarTurnoNoche() {
        LocalTime cincoPM = LocalTime.of(17, 0);
        LocalTime medianoche = LocalTime.of(0, 0);
        return repository.findAll().stream()
                .filter(p -> p.getOpenTime().isAfter(cincoPM) && p.getCloseTime().isBefore(medianoche))
                .collect(Collectors.toList());
    }
}
