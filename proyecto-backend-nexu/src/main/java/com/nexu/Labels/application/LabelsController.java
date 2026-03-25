package com.nexu.Labels.application;

import com.nexu.Labels.domain.LabelsService;
import com.nexu.Labels.dto.LabelsRequestDto;
import com.nexu.Labels.dto.LabelsResponseDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/labels")
public class LabelsController {

    private final LabelsService labelsService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping()
    public ResponseEntity<LabelsResponseDto> createLabel(@RequestBody LabelsRequestDto requestDto) {
        LabelsResponseDto label = labelsService.createLabel(requestDto);
        return ResponseEntity.ok(label);
    }

    @PreAuthorize("hasRole('VIEWER')")
    @GetMapping
    public ResponseEntity<List<LabelsResponseDto>> getAllLabels() {
        List<LabelsResponseDto> labels = labelsService.getAllLabels();
        return ResponseEntity.ok(labels);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<LabelsResponseDto> updateLabel(
            @PathVariable Long id,
            @RequestBody LabelsRequestDto labelRequestDTO) {
        LabelsResponseDto updatedLabel = labelsService.updateLabel(id, labelRequestDTO);
        return ResponseEntity.ok(updatedLabel);
    }

    @PreAuthorize("hasRole('VIEWER')")
    @GetMapping("/{id}")
    public ResponseEntity<LabelsResponseDto> getLabelById(@PathVariable Long id) {
        LabelsResponseDto label = labelsService.getLabelById(id);
        return ResponseEntity.ok(label);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabel(@PathVariable Long id) {
        labelsService.deleteLabel(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{labelId}/assign-to-place/{placeId}")
    public ResponseEntity<String> assignLabelToPlace(
            @PathVariable Long labelId,
            @PathVariable Long placeId) {
        labelsService.assignLabelToPlace(labelId, placeId);
        return ResponseEntity.ok("Etiqueta asignada correctamente al lugar.");
    }


}
