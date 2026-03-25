package com.nexu.Plans.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexu.Plans.domain.PlansService;
import com.nexu.Plans.domain.VisibilityPlans;
import com.nexu.Plans.dto.PlansRequestDto;
import com.nexu.Plans.dto.PlansResponseDto;
import com.nexu.Users.domain.Users;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Import(PlansControllerTest.TestSecurityOverride.class)
@ComponentScan(basePackages = "com.nexu.Plans")
@WebMvcTest(PlansController.class)
class PlansControllerTest {

    @Configuration
    static class TestSecurityOverride {
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            return http
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                    .csrf(csrf -> csrf.disable())
                    .build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlansService plansService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCreatePlanSuccessfully() throws Exception {
        Users mockUser = new Users();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setName("Test User");

        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        PlansRequestDto request = new PlansRequestDto();
        request.setName("Plan A");
        request.setDescription("Descripción de prueba");
        request.setStartDate(LocalDate.of(2025, 6, 1));
        request.setEndDate(LocalDate.of(2025, 6, 10));
        request.setVisibility(VisibilityPlans.PUBLIC);


        doNothing().when(plansService).createPlan(any(PlansRequestDto.class), eq(1L));

        mockMvc.perform(post("/plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated()); // Solo se valida el status
    }


    @Test
    void shouldGetPlanById() throws Exception {
        PlansResponseDto response = new PlansResponseDto();
        response.setName("Plan A");
        response.setDescription("Descripción");

        when(plansService.getPlanById(1L)).thenReturn(response);

        mockMvc.perform(get("/plans/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Plan A"))
                .andExpect(jsonPath("$.description").value("Descripción"));
    }

    @Test
    void shouldUpdatePlan() throws Exception {
        PlansRequestDto request = new PlansRequestDto();
        request.setName("Plan Modificado");
        request.setDescription("Nuevo texto");
        request.setVisibility(VisibilityPlans.PUBLIC);

        PlansResponseDto response = new PlansResponseDto();
        response.setName("Plan Modificado");
        response.setDescription("Nuevo texto");
        response.setVisibility(VisibilityPlans.PUBLIC);

        when(plansService.updatePlan(eq(1L), any(PlansRequestDto.class))).thenReturn(response);

        mockMvc.perform(put("/plans/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Plan Modificado"))
                .andExpect(jsonPath("$.description").value("Nuevo texto"))
                .andExpect(jsonPath("$.visibility").value("PUBLIC"));
    }

    @Test
    void shouldDeletePlan() throws Exception {
        // Arrange: Simula un usuario autenticado con ID 42
        Users mockUser = new Users();
        mockUser.setId(42L);

        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Act: Ejecuta el DELETE
        mockMvc.perform(delete("/plans/1"))
                .andExpect(status().isNoContent());

        // Assert: Verifica que se llamó al service con los dos argumentos correctos
        verify(plansService).deletePlan(1L, 42L);
    }

    @Test
    void shouldReturnPlansByUserId() throws Exception {
        PlansResponseDto p1 = new PlansResponseDto();
        p1.setName("Plan A");

        PlansResponseDto p2 = new PlansResponseDto();
        p2.setName("Plan B");

        when(plansService.getAllPlansByUserId(10L)).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/plans/me/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Plan A"))
                .andExpect(jsonPath("$[1].name").value("Plan B"));
    }
}