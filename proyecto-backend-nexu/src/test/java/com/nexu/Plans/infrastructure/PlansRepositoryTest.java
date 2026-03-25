package com.nexu.Plans.infrastructure;

import com.nexu.config.PostgresTestContainerConfig;
import com.nexu.Plans.domain.Plans;
import com.nexu.Plans.domain.VisibilityPlans;
import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import com.nexu.Users.domain.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

@DataJpaTest
@Testcontainers
@Import(PostgresTestContainerConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PlansRepositoryTest {

    @Autowired
    private PlansRepository plansRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Users testUser;
    private Plans publicPlan;
    private Plans privatePlan;

    @BeforeEach
    void setUp() {
        // Limpiar datos antes de cada test
        plansRepository.deleteAll();

        // Crear usuario de prueba
        testUser = new Users();
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setRole(UserRole.USER);
        testUser.setStatus(UserStatus.ACTIVE);
        entityManager.persist(testUser);

        // Crear planes de prueba
        publicPlan = new Plans();
        publicPlan.setName("Public Vacation");
        publicPlan.setDescription("Summer vacation plan");
        publicPlan.setStartDate(LocalDate.now().plusDays(7));
        publicPlan.setEndDate(LocalDate.now().plusDays(14));
        publicPlan.setVisibility(VisibilityPlans.PUBLIC);
        publicPlan.setCreator(testUser);
        entityManager.persist(publicPlan);

        privatePlan = new Plans();
        privatePlan.setName("Private Work Plan");
        privatePlan.setDescription("Confidential work schedule");
        privatePlan.setStartDate(LocalDate.now().plusDays(1));
        privatePlan.setEndDate(LocalDate.now().plusDays(2));
        privatePlan.setVisibility(VisibilityPlans.PRIVATE);
        privatePlan.setCreator(testUser);
        entityManager.persist(privatePlan);

        entityManager.flush();
    }

    @Test
    void shouldSavePlan() {
        Plans newPlan = new Plans();
        newPlan.setName("New Plan");
        newPlan.setDescription("New plan description");
        newPlan.setStartDate(LocalDate.now().plusDays(3));
        newPlan.setEndDate(LocalDate.now().plusDays(5));
        newPlan.setVisibility(VisibilityPlans.RESTRICTED);
        newPlan.setCreator(testUser);

        Plans savedPlan = plansRepository.save(newPlan);

        assertThat(savedPlan).isNotNull();
        assertThat(savedPlan.getId()).isNotNull();
        assertThat(savedPlan.getName()).isEqualTo("New Plan");
        assertThat(savedPlan.getDescription()).isEqualTo("New plan description");
        assertThat(savedPlan.getVisibility()).isEqualTo(VisibilityPlans.RESTRICTED);
        assertThat(savedPlan.getCreator()).isEqualTo(testUser);
    }

    @Test
    void shouldFindPlanById() {
        Optional<Plans> foundPlan = plansRepository.findById(publicPlan.getId());

        assertThat(foundPlan).isPresent();
        assertThat(foundPlan.get().getName()).isEqualTo("Public Vacation");
        assertThat(foundPlan.get().getVisibility()).isEqualTo(VisibilityPlans.PUBLIC);
    }

    @Test
    void shouldFindAllPlans() {
        Set<Plans> plans = Set.copyOf(plansRepository.findAll());

        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(Plans::getName)
                .containsExactlyInAnyOrder("Public Vacation", "Private Work Plan");
    }

    @Test
    void shouldUpdatePlan() {
        publicPlan.setDescription("Updated vacation plan");
        publicPlan.setVisibility(VisibilityPlans.RESTRICTED);

        Plans updatedPlan = plansRepository.save(publicPlan);

        assertThat(updatedPlan.getDescription()).isEqualTo("Updated vacation plan");
        assertThat(updatedPlan.getVisibility()).isEqualTo(VisibilityPlans.RESTRICTED);
    }

    @Test
    void shouldDeletePlan() {
        plansRepository.delete(privatePlan);

        Optional<Plans> deletedPlan = plansRepository.findById(privatePlan.getId());
        assertThat(deletedPlan).isEmpty();
    }

    @Test
    void shouldFindByVisibility() {
        Set<Plans> publicPlans = Set.copyOf(plansRepository.findByVisibility(VisibilityPlans.PUBLIC));

        assertThat(publicPlans).hasSize(1);
        assertThat(publicPlans.iterator().next().getName()).isEqualTo("Public Vacation");
    }

    @Test
    void shouldFindByCreator() {
        Set<Plans> userPlans = Set.copyOf(plansRepository.findByCreator(testUser));

        assertThat(userPlans).hasSize(2);
        assertThat(userPlans).extracting(Plans::getName)
                .containsExactlyInAnyOrder("Public Vacation", "Private Work Plan");
    }

    @Test
    void shouldAutoSetCreatedDateOnPersist() {
        Plans newPlan = new Plans();
        newPlan.setName("New Plan with Date");
        newPlan.setDescription("Testing auto date");
        newPlan.setVisibility(VisibilityPlans.PUBLIC);
        newPlan.setCreator(testUser);

        Plans savedPlan = plansRepository.save(newPlan);

        assertThat(savedPlan.getCreatedDate()).isCloseTo(LocalDateTime.now(), within(1, ChronoUnit.SECONDS));
    }

    @Test
    void shouldFindPlansByDateRange() {
        LocalDate start = LocalDate.now().plusDays(6);
        LocalDate end = LocalDate.now().plusDays(15);

        Set<Plans> plansInRange = Set.copyOf(plansRepository
                .findByStartDateGreaterThanEqualAndEndDateLessThanEqual(start, end));

        assertThat(plansInRange).hasSize(1);
        assertThat(plansInRange.iterator().next().getName()).isEqualTo("Public Vacation");
    }
}