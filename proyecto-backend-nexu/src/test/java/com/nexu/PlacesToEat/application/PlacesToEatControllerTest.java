package com.nexu.PlacesToEat.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexu.PlacesToEat.domain.PlacesToEatService;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.dto.PlacesToEatRequestDto;
import com.nexu.PlacesToEat.dto.PlacesToEatResponseDto;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PlacesToEatController.class)
@Import(PlacesToEatControllerTest.TestSecurityConfig.class)
@ComponentScan(basePackages = "com.nexu.PlacesToEat")
class PlacesToEatControllerTest {

    @Configuration
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            return http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()).csrf(csrf -> csrf.disable()).build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlacesToEatService service;

    @MockBean
    private ModelMapper modelMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreatePlace() throws Exception {
        PlacesToEatResponseDto responseDto = new PlacesToEatResponseDto();
        responseDto.setName("Café Vegano");

        Mockito.when(service.save(any())).thenReturn(responseDto);

        String json = """
                {
                    "name": "Café Vegano",
                    "address": "Av. Café 456",
                    "latitude": -12.0464,
                    "longitude": -77.0428,
                    "payment": "CASH",
                    "openTime": "08:00",
                    "closeTime": "22:00",
                    "description": "Opciones veganas y deliciosas",
                    "wifi": true,
                    "priceRange": "MEDIUM",
                    "estimatedPrice": 25.0,
                    "capacity": 30,
                    "status": "OPEN",
                    "labelIds": [1],
                    "placeCategoryToEat": "COFFEE"
                }
                """;

        mockMvc.perform(post("/places-to-eat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Café Vegano"));
    }

    @Test
    void testGetPlaceById() throws Exception {
        PlacesToEatResponseDto dto = new PlacesToEatResponseDto();
        dto.setName("Restaurante Criollo");

        Mockito.when(service.getPlaceById(1L)).thenReturn(dto);

        mockMvc.perform(get("/places-to-eat/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Restaurante Criollo"));
    }

    @Test
    void testGetAllPlaces() throws Exception {
        PlacesToEatResponseDto dto = new PlacesToEatResponseDto();
        dto.setName("Buffet Limeño");

        Mockito.when(service.getAllPlaces()).thenReturn(List.of(dto));

        mockMvc.perform(get("/places-to-eat"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Buffet Limeño"));
    }

    @Test
    void testDeletePlace() throws Exception {
        mockMvc.perform(delete("/places-to-eat/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testSearchPlaces() throws Exception {
        PlacesToEatResponseDto dto = new PlacesToEatResponseDto();
        dto.setName("Noches Criollas");

        Mockito.when(service.searchPlaces(eq("OPEN"), eq(PlaceCategoryToEat.RESTAURANT), eq(3.0), eq(5.0)))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/places-to-eat/search")
                        .param("status", "OPEN")
                        .param("category", "RESTAURANT")
                        .param("minQualification", "3.0")
                        .param("maxQualification", "5.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Noches Criollas"));
    }
}
