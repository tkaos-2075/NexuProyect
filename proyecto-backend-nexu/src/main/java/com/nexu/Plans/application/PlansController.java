package com.nexu.Plans.application;

import com.nexu.Plans.domain.PlansService;
import com.nexu.Plans.dto.PlansRequestDto;
import com.nexu.Plans.dto.PlansResponseDto;
import com.nexu.Users.domain.Users;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
public class PlansController {

    private final PlansService plansService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping
    public ResponseEntity<Void> createPlan(@RequestBody @Valid PlansRequestDto requestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();
        Long userId = user.getId();
        plansService.createPlan(requestDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<PlansResponseDto> getPlanById(@PathVariable Long id) {
        PlansResponseDto plansResponseDto = plansService.getPlanById(id);
        return ResponseEntity.ok(plansResponseDto);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<PlansResponseDto> updatePlan(@PathVariable Long id, @RequestBody @Valid PlansRequestDto requestDto) {
        PlansResponseDto plan = plansService.updatePlan(id, requestDto);
        return ResponseEntity.ok(plan);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();
        Long userId = user.getId();
        plansService.deletePlan(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/me/{id}")
    public ResponseEntity<List<PlansResponseDto>> getMyPlans(@PathVariable Long id) {
        List<PlansResponseDto> plans = plansService.getAllPlansByUserId(id);
        return ResponseEntity.ok(plans);
    }

}