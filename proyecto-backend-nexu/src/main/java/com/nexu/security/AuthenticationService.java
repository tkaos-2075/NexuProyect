package com.nexu.security;

import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.Users;
import com.nexu.Users.dto.UsersRequestDto;
import com.nexu.Users.dto.UsersResponseDto;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.events.WelcomeEmailEvent;
import com.nexu.security.dto.JwtAuthenticationResponse;
import com.nexu.Users.dto.SigninRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    UsersRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder; //Necesita estar configurado

    @Autowired
    JwtService jwtService; //Necesita estar configurado

    @Autowired
    AuthenticationManager authenticationManager; //Necesita estar configurado

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;


    public JwtAuthenticationResponse signup(UsersRequestDto userSignUpRequest) {
        // Mapear SigninRequest a Users
        Users user = modelMapper.map(userSignUpRequest, Users.class);

        user.setRole(UserRole.USER);
        // Encriptar la contraseña
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Guardar el usuario
        userRepository.save(user);

        // Generar el token JWT
        String jwt = jwtService.generateToken(user);

        // Crear respuesta
        JwtAuthenticationResponse response = new JwtAuthenticationResponse();
        response.setToken(jwt);
        applicationEventPublisher.publishEvent(new WelcomeEmailEvent(user.getEmail()));


        return response;
    }


    public JwtAuthenticationResponse login(SigninRequest request) throws IllegalArgumentException {
        // Autenticar credenciales del usuario
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Obtener el usuario por email y validar que exista
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Generar token JWT
        String jwt = jwtService.generateToken(user);

        // Crear y devolver la respuesta
        JwtAuthenticationResponse response = new JwtAuthenticationResponse();
        response.setToken(jwt);

        return response;
    }


    @Autowired
    private UsersRepository userAccountRepository;

    public UsersResponseDto getUserResponseByEmail(String email) {
        Users user = userAccountRepository.findUsersByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return modelMapper.map(user, UsersResponseDto.class);
    }


}
