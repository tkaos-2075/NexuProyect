package com.nexu.Labels.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexu.Labels.domain.LabelsService;
import com.nexu.Labels.domain.LabelsStatus;
import com.nexu.Labels.dto.LabelsRequestDto;
import com.nexu.Labels.dto.LabelsResponseDto;
import org.junit.jupiter.api.BeforeEach;
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
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LabelsController.class)
@Import(LabelsControllerTest.TestSecurityOverride.class)
@ComponentScan(basePackages = "com.nexu.Labels")
public class LabelsControllerTest {

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
    private LabelsService labelsService;

    @Autowired
    private ObjectMapper objectMapper;

    private LabelsRequestDto requestDto;
    private LabelsResponseDto responseDto;

    @BeforeEach
    void setUp() {
        requestDto = new LabelsRequestDto();
        requestDto.setName("Work");
        requestDto.setDescription("Work-related places");
        requestDto.setColor("#FF0000");
        requestDto.setStatus(LabelsStatus.ACTIVE);

        responseDto = new LabelsResponseDto();
        responseDto.setId(1L);
        responseDto.setName("Work");
        responseDto.setDescription("Work-related places");
        responseDto.setColor("#FF0000");
        responseDto.setStatus(LabelsStatus.ACTIVE);
        responseDto.setPlaceIds(Set.of());
    }

    @Test
    void testCreateLabel() throws Exception {
        Mockito.when(labelsService.createLabel(any())).thenReturn(responseDto);

        mockMvc.perform(post("/labels")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Work"));
    }

    @Test
    void testGetAllLabels() throws Exception {
        Mockito.when(labelsService.getAllLabels()).thenReturn(List.of(responseDto));

        mockMvc.perform(get("/labels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Work"));
    }

    @Test
    void testGetLabelById() throws Exception {
        Mockito.when(labelsService.getLabelById(1L)).thenReturn(responseDto);

        mockMvc.perform(get("/labels/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Work"));
    }

    @Test
    void testUpdateLabel() throws Exception {
        Mockito.when(labelsService.updateLabel(eq(1L), any())).thenReturn(responseDto);

        mockMvc.perform(put("/labels/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Work"));
    }

    @Test
    void testDeleteLabel() throws Exception {
        mockMvc.perform(delete("/labels/1"))
                .andExpect(status().isNoContent());
    }
}
