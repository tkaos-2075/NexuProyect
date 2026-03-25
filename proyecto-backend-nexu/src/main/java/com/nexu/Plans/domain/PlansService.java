
package com.nexu.Plans.domain;

import com.nexu.Places.domain.Places;
import com.nexu.Places.infrastructure.DefaultPlacesRepository;
import com.nexu.Plans.dto.PlansRequestDto;
import com.nexu.Plans.dto.PlansResponseDto;
import com.nexu.Plans.infrastructure.PlansRepository;
import com.nexu.Users.domain.Users;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.events.PlanCreationEmailEvent;
import com.nexu.exception.AccessDeniedException;
import com.nexu.exception.BadRequestException;
import com.nexu.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlansService {

    private final PlansRepository plansRepository;
    private final UsersRepository userRepository;
    private final ModelMapper modelMapper;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final UsersRepository usersRepository;
    private final DefaultPlacesRepository placesRepository;

    // Funciones de apoyo para acciones repetitivas
    public <T> Set<T> matchById(Set<Long> ids, Function<Long, Optional<T>> finder, String errorMsg) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptySet();
        }

        Set<T> result = new HashSet<>();
        for (Long id : ids) {
            T entity = finder.apply(id)
                    .orElseThrow(() -> new ResourceNotFoundException(errorMsg + id));
            result.add(entity);
        }
        return result;
    }

    public void createPlan(PlansRequestDto requestDto, Long creatorId) {
        if (plansRepository.existsByName(requestDto.getName())) {
            throw new BadRequestException("Ya existe un plan con el nombre: " + requestDto.getName());
        }

        Users creator = usersRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario creador no encontrado con ID: " + creatorId));

        Plans plan = modelMapper.map(requestDto, Plans.class);
        plan.setCreator(creator);
        // Guardar los user relacionados al plan
        Set<Users> users = matchById(
                requestDto.getUsersId(),
                usersRepository::findById,
                "Usuario no encontrado con ID: "
        );
        // Si el resultado es vacío o no, agregamos el creador igual
        users = new HashSet<>(users); // para asegurar que sea mutable
        users.add(creator);
        plan.setUsers(users);

        // Guardar los places relacionados al plan
        Set<Places> places = matchById(
                requestDto.getPlacesId(),
                placesRepository::findById,
                "Lugar no encontrado con ID: "
        );
        plan.setPlaces(places);
        plan = plansRepository.save(plan);
        // Obtener email del creator
        String email = creator.getUsername();
        applicationEventPublisher.publishEvent(new PlanCreationEmailEvent(email, plan));
    }


    public PlansResponseDto getPlanById(Long id) {
        Plans plan = plansRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado con ID: " + id));

        return mapToPlansResponseDto(plan);
    }

    private PlansResponseDto mapToPlansResponseDto(Plans plan) {
        PlansResponseDto dto = modelMapper.map(plan, PlansResponseDto.class);

        Set<Users> usersCopy = new HashSet<>(plan.getUsers());
        dto.setUsersId(usersCopy.stream()
                .map(Users::getId)
                .collect(Collectors.toSet()));

        Set<Places> placesCopy = new HashSet<>(plan.getPlaces());
        dto.setPlacesId(placesCopy.stream()
                .map(Places::getId)
                .collect(Collectors.toSet()));

        dto.setCreatorId(plan.getCreator() != null ? plan.getCreator().getId() : null);

        return dto;
    }


    public PlansResponseDto updatePlan(Long id, PlansRequestDto requestDto) {
        Plans plan = plansRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado con ID: " + id));

        // Solo mapear los campos no nulos del requestDto
        if (requestDto.getName() != null) {
            plan.setName(requestDto.getName());
        }
        if (requestDto.getDescription() != null) {
            plan.setDescription(requestDto.getDescription());
        }
        if (requestDto.getStartDate() != null) {
            plan.setStartDate(requestDto.getStartDate());
        }
        if (requestDto.getEndDate() != null) {
            plan.setEndDate(requestDto.getEndDate());
        }
        if (requestDto.getVisibility() != null) {
            plan.setVisibility(requestDto.getVisibility());
        }

        // Actualizar usuarios si se proporciona la lista
        if (requestDto.getUsersId() != null) {
            Set<Users> users = matchById(
                    requestDto.getUsersId(),
                    usersRepository::findById,
                    "Usuario no encontrado con ID: "
            );
            plan.setUsers(users);
        }

        // Actualizar lugares si se proporciona la lista
        if (requestDto.getPlacesId() != null) {
            Set<Places> places = matchById(
                    requestDto.getPlacesId(),
                    placesRepository::findById,
                    "Lugar no encontrado con ID: "
            );
            plan.setPlaces(places);
        }

        plan = plansRepository.save(plan);
        return mapToPlansResponseDto(plan);
    }


    public void deletePlan(Long id, Long creatorId) {
        Plans plan = plansRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado con ID: " + id));

        if (!plan.getCreator().getId().equals(creatorId)) {
            throw new AccessDeniedException("No tienes permiso para eliminar este plan");
        }

        plansRepository.deleteById(id);
    }



    public List<PlansResponseDto> getAllPlansByUserId(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + userId));

        Set<Plans> plans = new HashSet<>(user.getPlans());

        return plans.stream()
                .map(this::mapToPlansResponseDto)  // Usamos la función para mapear
                .collect(Collectors.toList());
    }



}

