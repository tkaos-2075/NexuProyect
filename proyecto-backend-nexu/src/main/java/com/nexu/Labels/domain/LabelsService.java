package com.nexu.Labels.domain;

import com.nexu.Labels.dto.LabelsRequestDto;
import com.nexu.Labels.dto.LabelsResponseDto;
import com.nexu.Labels.infrastructure.LabelsRepository;
import com.nexu.Places.domain.Places;
import com.nexu.Places.infrastructure.DefaultPlacesRepository;
import com.nexu.exception.BadRequestException;
import com.nexu.exception.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class LabelsService {

    private final LabelsRepository labelsRepository;
    private final ModelMapper modelMapper;
    private final DefaultPlacesRepository placesRepository;

    private LabelsResponseDto mapToLabelsResponseDto(Labels label) {
        LabelsResponseDto dto = modelMapper.map(label, LabelsResponseDto.class);

        if (label.getPlaces() != null) {
            dto.setPlaceIds(
                    label.getPlaces().stream()
                            .map(Places::getId)
                            .collect(Collectors.toSet())
            );
        }

        return dto;
    }

    public LabelsResponseDto createLabel(LabelsRequestDto requestDto) {
        if (labelsRepository.existsByName(requestDto.getName())) {
            throw new BadRequestException("Ya existe una etiqueta con el nombre: " + requestDto.getName());
        }
        Labels label = modelMapper.map(requestDto, Labels.class);
        label.setStatus(LabelsStatus.ACTIVE);
        label = labelsRepository.save(label);
        return modelMapper.map(label, LabelsResponseDto.class);
    }

    public List<LabelsResponseDto> getAllLabels() {
        return labelsRepository.findAll().stream()
                .map(this::mapToLabelsResponseDto)
                .toList();
    }

    public LabelsResponseDto updateLabel(Long id, LabelsRequestDto labelsRequestDto) {
        Labels existingLabel = labelsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label no encontrado con id: " + id));

        modelMapper.map(labelsRequestDto, existingLabel);

        Labels updatedLabel = labelsRepository.save(existingLabel);

        return modelMapper.map(updatedLabel, LabelsResponseDto.class);
    }

    public LabelsResponseDto getLabelById(Long id) {
        Labels label = labelsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label no encontrado con id: " + id));
        return mapToLabelsResponseDto(label);
    }

    @Transactional
    public void deleteLabel(Long id) {
        Labels label = labelsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label no encontrado con id: " + id));
        labelsRepository.deleteById(id);
    }

    public void assignLabelToPlace(Long labelId, Long placeId) {
        Labels label = labelsRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Etiqueta no encontrada con ID: " + labelId));

        Places place = placesRepository.findById(placeId)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar no encontrado con ID: " + placeId));

        // Asegura que no sea null
        if (label.getPlaces() == null) {
            label.setPlaces(new HashSet<>());
        }

        label.getPlaces().add(place); // este es el lado propietario

        // (Opcional) Para mantener consistencia del lado inverso
        if (place.getLabels() == null) {
            place.setLabels(new HashSet<>());
        }
        place.getLabels().add(label);

        // Guardas solo el propietario
        labelsRepository.save(label);
    }
}
