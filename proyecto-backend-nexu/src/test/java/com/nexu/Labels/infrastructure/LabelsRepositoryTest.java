package com.nexu.Labels.infrastructure;

import com.nexu.config.PostgresTestContainerConfig;
import com.nexu.Labels.domain.Labels;
import com.nexu.Labels.domain.LabelsStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@Import(PostgresTestContainerConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class LabelsRepositoryTest {
    @Autowired
    private LabelsRepository labelsRepository;

    private Labels activeLabel;
    private Labels inactiveLabel;

    @BeforeEach
    void setUp() {
        // Clear the database before each test
        labelsRepository.deleteAll();

        // Create test data manually with setters
        activeLabel = new Labels();
        activeLabel.setName("Restaurant");
        activeLabel.setDescription("Places to eat");
        activeLabel.setColor("#FF5733");
        activeLabel.setStatus(LabelsStatus.ACTIVE);

        inactiveLabel = new Labels();
        inactiveLabel.setName("Closed");
        inactiveLabel.setDescription("Places no longer operating");
        inactiveLabel.setColor("#808080");
        inactiveLabel.setStatus(LabelsStatus.INACTIVE);

        labelsRepository.saveAll(List.of(activeLabel, inactiveLabel));
    }

    @Test
    void shouldSaveLabel() {
        Labels newLabel = new Labels();
        newLabel.setName("Park");
        newLabel.setDescription("Public parks and green areas");
        newLabel.setColor("#4CAF50");
        newLabel.setStatus(LabelsStatus.ACTIVE);

        Labels savedLabel = labelsRepository.save(newLabel);

        assertThat(savedLabel).isNotNull();
        assertThat(savedLabel.getId()).isNotNull();
        assertThat(savedLabel.getName()).isEqualTo(newLabel.getName());
        assertThat(savedLabel.getDescription()).isEqualTo(newLabel.getDescription());
        assertThat(savedLabel.getColor()).isEqualTo(newLabel.getColor());
        assertThat(savedLabel.getStatus()).isEqualTo(newLabel.getStatus());
    }

    @Test
    void shouldFindLabelById() {
        Optional<Labels> foundLabel = labelsRepository.findById(activeLabel.getId());

        assertThat(foundLabel).isPresent();
        assertThat(foundLabel.get().getName()).isEqualTo(activeLabel.getName());
    }

    @Test
    void shouldFindAllLabels() {
        List<Labels> labels = labelsRepository.findAll();

        assertThat(labels).hasSize(2);
        assertThat(labels).extracting(Labels::getName)
                .containsExactlyInAnyOrder("Restaurant", "Closed");
    }

    @Test
    void shouldUpdateLabel() {
        activeLabel.setDescription("Updated description");
        activeLabel.setColor("#000000");

        Labels updatedLabel = labelsRepository.save(activeLabel);

        assertThat(updatedLabel.getDescription()).isEqualTo("Updated description");
        assertThat(updatedLabel.getColor()).isEqualTo("#000000");
    }

    @Test
    void shouldDeleteLabel() {
        labelsRepository.delete(activeLabel);

        Optional<Labels> deletedLabel = labelsRepository.findById(activeLabel.getId());
        assertThat(deletedLabel).isEmpty();
    }

    @Test
    void shouldFindByName() {
        Optional<Labels> foundLabel = labelsRepository.findByName("Restaurant");

        assertThat(foundLabel).isPresent();
        assertThat(foundLabel.get().getName()).isEqualTo("Restaurant");
    }

    @Test
    void shouldFindByStatus() {
        List<Labels> activeLabels = labelsRepository.findByStatus(LabelsStatus.ACTIVE);

        assertThat(activeLabels).hasSize(1);
        assertThat(activeLabels.get(0).getStatus()).isEqualTo(LabelsStatus.ACTIVE);
    }

    @Test
    void shouldExistsByName() {
        boolean exists = labelsRepository.existsByName("Restaurant");

        assertThat(exists).isTrue();
    }

    @Test
    void shouldNotExistsByNonExistingName() {
        boolean exists = labelsRepository.existsByName("NonExisting");

        assertThat(exists).isFalse();
    }

    @Test
    void shouldFindByColor() {
        List<Labels> labels = labelsRepository.findByColor("#808080");

        assertThat(labels).hasSize(1);
        assertThat(labels.get(0).getColor()).isEqualTo("#808080");
    }
}