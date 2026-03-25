package com.nexu.PlacesToFun.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexu.PlacesToFun.domain.PlacesToFunService;
import com.nexu.PlacesToFun.dto.PlacesToFunResponseDto;
import com.nexu.PlacesToFun.domain.enums.PlaceCategoryToFun;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PlacesToFunController.class)
@Import(PlacesToFunControllerTest.TestSecurityOverride.class)
@ComponentScan(basePackages = "com.nexu.PlacesToFun")
class PlacesToFunControllerTest {

    @Configuration
    static class TestSecurityOverride {
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            return http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()).csrf(csrf -> csrf.disable()).build();
        }
    }

    @Autowired private MockMvc mockMvc;
    @MockBean private PlacesToFunService service;
    @MockBean private ModelMapper modelMapper;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void testCreatePlace() throws Exception {
        String requestJson = """
            {
                \"name\": \"Parque de Diversiones\",
                \"address\": \"Av. Alegría 123\",
                \"latitude\": -12.0464,
                \"longitude\": -77.0428,
                \"openTime\": \"10:00\",
                \"closeTime\": \"22:00\",
                \"payment\": \"CASH\",
                \"wifi\": true,
                \"description\": \"Diversión asegurada\",
                \"priceRange\": \"MEDIUM\",
                \"estimatedPrice\": 30.0,
                \"capacity\": 100,
                \"status\": \"OPEN\",
                \"labelIds\": [1, 2],
                \"placeCategoryToFun\": \"PARK\"
            }
        """;

        PlacesToFunResponseDto responseDto = new PlacesToFunResponseDto();
        responseDto.setName("Parque de Diversiones");

        Mockito.when(service.save(any())).thenReturn(responseDto);

        mockMvc.perform(post("/places-to-fun")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Parque de Diversiones"));
    }

    @Test
    void testGetPlaceById() throws Exception {
        PlacesToFunResponseDto response = new PlacesToFunResponseDto();
        response.setName("Parque X");
        Mockito.when(service.getPlaceById(1L)).thenReturn(response);

        mockMvc.perform(get("/places-to-fun/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Parque X"));
    }

    @Test
    void testGetAllPlaces() throws Exception {
        PlacesToFunResponseDto dto = new PlacesToFunResponseDto();
        dto.setName("Juegos Extremos");
        Mockito.when(service.getAllPlaces()).thenReturn(List.of(dto));

        mockMvc.perform(get("/places-to-fun"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Juegos Extremos"));
    }

    @Test
    void testDeletePlace() throws Exception {
        mockMvc.perform(delete("/places-to-fun/1"))
                .andExpect(status().isNoContent());
        Mockito.doNothing().when(service).deletePlace(1L);
    }

    @Test
    void testSearchPlaces() throws Exception {
        PlacesToFunResponseDto dto = new PlacesToFunResponseDto();
        dto.setName("Filtro");
        Mockito.when(service.searchPlaces(eq("OPEN"), eq(PlaceCategoryToFun.PARK), eq(4.0), eq(5.0)))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/places-to-fun/search")
                        .param("status", "OPEN")
                        .param("category", "PARK")
                        .param("minQualification", "4.0")
                        .param("maxQualification", "5.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Filtro"));
    }
}
