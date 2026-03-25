package com.nexu.Users.application;

import com.nexu.Users.domain.UsersService;
import com.nexu.Users.dto.SigninRequest;
import com.nexu.Users.dto.UsersRequestDto;
import com.nexu.Users.dto.UsersResponseDto;
import com.nexu.security.AuthenticationService;
import com.nexu.security.dto.JwtAuthenticationResponse;
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
@RequestMapping("/users")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService userService;
    private final AuthenticationService authenticationService;

    // Crear usuario (signup)
    @PostMapping("/signup")
    public ResponseEntity<JwtAuthenticationResponse> createUser(@Valid @RequestBody UsersRequestDto dto) {
        JwtAuthenticationResponse response = authenticationService.signup(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> login(@Valid @RequestBody SigninRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    // usuario logeado
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UsersResponseDto> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UsersResponseDto response = authenticationService.getUserResponseByEmail(email);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<UsersResponseDto> getUserById(@PathVariable Long id) {
        UsersResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping
    public ResponseEntity<List<UsersResponseDto>> getAllUsers() {
        List<UsersResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<UsersResponseDto> updateUser(@PathVariable Long id, @Valid @RequestBody UsersRequestDto dto) {
        UsersResponseDto updatedUser = userService.updateUser(id, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
