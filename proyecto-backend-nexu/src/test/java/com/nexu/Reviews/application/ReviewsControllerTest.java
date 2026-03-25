package com.nexu.Reviews.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexu.Reviews.application.ReviewsController;
import com.nexu.Reviews.domain.ReviewsService;
import com.nexu.Reviews.dto.ReviewRequestDto;
import com.nexu.Reviews.dto.ReviewResponseDto;
import com.nexu.Users.domain.Users;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.mockito.ArgumentMatchers.eq;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ReviewsController.class)
@Import(ReviewsControllerTest.TestSecurityOverride.class)
@ComponentScan(basePackages = "com.nexu.Reviews")
class ReviewsControllerTest {

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

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewsService reviewsService;

    private void mockAuthenticatedUser(Long userId) {
        Users user = new Users();
        user.setId(userId);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);

        SecurityContextHolder.setContext(securityContext);
    }


    @Test
    void testCreateReview() throws Exception {
        mockAuthenticatedUser(1L); // Simula un usuario autenticado con ID = 1

        String requestJson = """
    {
        "comment": "Muy bueno",
        "rating": 5,
        "pictures": []
    }
""";

        // No importa lo que devuelva, porque el controlador no lo usa
        when(reviewsService.createReview(any(ReviewRequestDto.class), eq(1L), eq(2L)))
                .thenReturn(new ReviewResponseDto());

        mockMvc.perform(post("/reviews")
                        .param("placeId", "2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isCreated());
    }


    @Test
    void testGetReviewById() throws Exception {
        ReviewResponseDto response = new ReviewResponseDto();
        response.setId(1L);
        response.setComment("Excelente");

        when(reviewsService.getReviewById(1L)).thenReturn(response);

        mockMvc.perform(get("/reviews/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comment").value("Excelente"));
    }

    @Test
    void testUpdateReview() throws Exception {
        mockAuthenticatedUser(1L);

        String requestJson = """
    {
        "comment": "Actualizado",
        "rating": 4,
        "pictures": []
    }
""";

        when(reviewsService.updateReview(eq(1L), any(ReviewRequestDto.class), eq(1L)))
                .thenReturn(new ReviewResponseDto());

        mockMvc.perform(put("/reviews/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteReview() throws Exception {
        mockAuthenticatedUser(1L);

        mockMvc.perform(delete("/reviews/1"))
                .andExpect(status().isNoContent());
    }


    @Test
    void testGetReviewsByUser() throws Exception {
        when(reviewsService.getReviewsByUserId(1L)).thenReturn(List.of(new ReviewResponseDto()));

        mockMvc.perform(get("/reviews/user/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetReviewsByPlace() throws Exception {
        when(reviewsService.getReviewsByPlaceId(1L)).thenReturn(List.of(new ReviewResponseDto()));

        mockMvc.perform(get("/reviews/place/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testIncrementLikes() throws Exception {
        mockAuthenticatedUser(1L);

        when(reviewsService.incrementLikes(1L, 1L))
                .thenReturn(new ReviewResponseDto());

        mockMvc.perform(patch("/reviews/1/like"))
                .andExpect(status().isOk());
    }

}
