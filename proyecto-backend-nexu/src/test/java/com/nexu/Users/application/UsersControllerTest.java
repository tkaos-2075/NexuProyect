package com.nexu.Users.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexu.Users.domain.UsersService;
import com.nexu.Users.dto.SigninRequest;
import com.nexu.Users.dto.UsersRequestDto;
import com.nexu.Users.dto.UsersResponseDto;
import com.nexu.security.AuthenticationService;
import com.nexu.security.dto.JwtAuthenticationResponse;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UsersController.class)
@Import(UsersControllerTest.TestSecurityOverride.class)
@ComponentScan(basePackages = "com.nexu.Users")
class UsersControllerTest {

    @Configuration
    static class TestSecurityOverride {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            return http
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                    .csrf(csrf -> csrf.disable())
                    .build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsersService usersService;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private ApplicationEventPublisher applicationEventPublisher;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateUser() throws Exception {
        UsersRequestDto request = new UsersRequestDto();
        request.setEmail("test@user.com");
        request.setPassword("123456");
        request.setName("Test User");

        UsersResponseDto createdUser = new UsersResponseDto();
        createdUser.setId(1L);
        createdUser.setEmail("test@user.com");
        createdUser.setName("Test User");

        JwtAuthenticationResponse jwtResponse = new JwtAuthenticationResponse("fake-jwt-token");

        Mockito.when(authenticationService.signup(any())).thenReturn(jwtResponse);

        mockMvc.perform(post("/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));  // CAMBIO aquí
    }

    @Test
    void testLogin() throws Exception {
        SigninRequest signinRequest = new SigninRequest();
        signinRequest.setEmail("login@user.com");
        signinRequest.setPassword("password");

        JwtAuthenticationResponse jwtResponse = new JwtAuthenticationResponse("jwt-login-token");

        Mockito.when(authenticationService.login(any())).thenReturn(jwtResponse);

        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signinRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-login-token"));  // CAMBIO aquí
    }


    @Test
    void testGetUserById() throws Exception {
        UsersResponseDto response = new UsersResponseDto();
        response.setId(1L);
        response.setEmail("user@demo.com");
        response.setName("Demo User");

        Mockito.when(usersService.getUserById(1L)).thenReturn(response);

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Demo User"));
    }

    @Test
    void testGetAllUsers() throws Exception {
        UsersResponseDto user = new UsersResponseDto();
        user.setId(1L);
        user.setEmail("all@user.com");

        Mockito.when(usersService.getAllUsers()).thenReturn(List.of(user));

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testUpdateUser() throws Exception {
        UsersRequestDto request = new UsersRequestDto();
        request.setEmail("updated@user.com");
        request.setPassword("123456");
        request.setName("Updated Name");

        UsersResponseDto response = new UsersResponseDto();
        response.setId(1L);
        response.setEmail("updated@user.com");
        response.setName("Updated Name");

        Mockito.when(usersService.updateUser(eq(1L), any())).thenReturn(response);

        mockMvc.perform(put("/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("updated@user.com"));
    }

    @Test
    void testDeleteUser() throws Exception {
        Mockito.when(usersService.getEmailById(1L)).thenReturn("deleted@user.com");

        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isNoContent());
    }
}
