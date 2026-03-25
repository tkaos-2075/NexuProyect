package com.nexu.Users.domain;

import com.nexu.events.AccountDeletionEmailEvent;
import com.nexu.Users.dto.UsersRequestDto;
import com.nexu.Users.dto.UsersResponseDto;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.exception.AccessDeniedException;
import com.nexu.exception.ResourceNotFoundException;
import com.nexu.security.AuthUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsersService{

    private final AuthUtils authUtils;
    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher applicationEventPublisher;

    public UsersResponseDto updateUser(Long id, UsersRequestDto dto) {
        Users actualUser = authUtils.getAuthenticatedUser();

        if (!actualUser.getId().equals(id)) {
            throw new AccessDeniedException("No tienes permisos para actualizar este usuario.");
        }

        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        // Guardar la contraseña actual antes de mapear
        String currentPassword = user.getPassword();

        modelMapper.map(dto, user);

        // Si el DTO trae un campo de nueva contraseña y no está vacío, hashearla
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            // Si usas el mismo campo para password
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            // Si no se envía nueva contraseña, mantener la anterior
            user.setPassword(currentPassword);
        }


        user = usersRepository.save(user);
        return modelMapper.map(user, UsersResponseDto.class);
    }

    public void deleteUser(Long id) {
        Users actualUser = authUtils.getAuthenticatedUser();

        if (!actualUser.getId().equals(id)) {
            throw new AccessDeniedException("No tienes permisos para eliminar este usuario.");
        }
        // Verificar si el usuario existe
        if (!usersRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con ID: " + id);
        }
        // Obtener email antes de eliminar
        String email = actualUser.getEmail();

        // Eliminar usuario
        usersRepository.deleteById(id);
        // Publicar evento asincrónico con el email
        applicationEventPublisher.publishEvent(new AccountDeletionEmailEvent(email));
    }


    public UsersResponseDto getUserById(Long id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return modelMapper.map(user, UsersResponseDto.class);
    }

    public List<UsersResponseDto> getAllUsers() {
        return usersRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UsersResponseDto.class))
                .collect(Collectors.toList());
    }

    public String getEmailById(Long id) {
        return usersRepository.findById(id)
                .map(Users::getEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
    }

    //    security
    public List<Users> list() {
        return usersRepository.findAll();
    }
    public void save(Users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        usersRepository.save(user);
    }


}