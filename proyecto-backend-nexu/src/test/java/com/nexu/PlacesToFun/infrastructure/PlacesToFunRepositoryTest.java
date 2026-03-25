package com.nexu.PlacesToFun.infrastructure;

import com.nexu.Places.domain.enums.Payment;
import com.nexu.Places.domain.enums.Status;
import com.nexu.PlacesToFun.domain.PlacesToFun;
import com.nexu.PlacesToFun.domain.enums.PlaceCategoryToFun;
import com.nexu.PlacesToFun.domain.enums.SizePark;
import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import com.nexu.Users.domain.Users;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.config.PostgresTestContainerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@Import(PostgresTestContainerConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PlacesToFunRepositoryTest {

    @Autowired
    private PlacesToFunRepository placesToFunRepository;

    @Autowired
    private UsersRepository usersRepository;

    private Users creator;

    @BeforeEach
    void setUp() {
        creator = new Users();
        creator.setEmail("funowner@example.com");
        creator.setPassword("pass1234");
        creator.setName("Fun Owner");
        creator.setRole(UserRole.ADMIN);
        creator.setStatus(UserStatus.ACTIVE);
        usersRepository.save(creator);
    }

    @Test
    void shouldSavePlaceToFunWithGames() {
        PlacesToFun place = new PlacesToFun();
        place.setName("Game Zone");
        place.setAddress("456 Arcade St");
        place.setLatitude(3.3);
        place.setLongitude(4.4);
        place.setOpenTime(LocalTime.of(10, 0));
        place.setCloseTime(LocalTime.of(23, 0));
        place.setPayment(Payment.CASH);
        place.setStatus(Status.OPEN);
        place.setCreator(creator);
        place.setPlaceCategoryToFun(PlaceCategoryToFun.GAMES);
        place.setGames(Arrays.asList("Pinball", "Air Hockey"));
        place.setPriceFicha(1.5);

        PlacesToFun saved = placesToFunRepository.save(place);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getGames()).contains("Pinball", "Air Hockey");
        assertThat(saved.getPriceFicha()).isEqualTo(1.5);
    }

    @Test
    void shouldFindById() {
        PlacesToFun place = buildSamplePlace("Fun Park");
        PlacesToFun saved = placesToFunRepository.save(place);

        Optional<PlacesToFun> found = placesToFunRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Fun Park");
    }

    @Test
    void shouldUpdatePlace() {
        PlacesToFun place = buildSamplePlace("Update Fun");
        PlacesToFun saved = placesToFunRepository.save(place);

        saved.setHaveGames(false);
        saved.setAddress("New Address 789");

        PlacesToFun updated = placesToFunRepository.save(saved);

        assertThat(updated.getHaveGames()).isFalse();
        assertThat(updated.getAddress()).isEqualTo("New Address 789");
    }

    @Test
    void shouldDeletePlace() {
        PlacesToFun place = buildSamplePlace("To Delete");
        PlacesToFun saved = placesToFunRepository.save(place);

        Long id = saved.getId();
        placesToFunRepository.deleteById(id);

        Optional<PlacesToFun> deleted = placesToFunRepository.findById(id);
        assertThat(deleted).isEmpty();
    }

    @Test
    void shouldListAllPlacesToFun() {
        placesToFunRepository.save(buildSamplePlace("Park A"));
        placesToFunRepository.save(buildSamplePlace("Park B"));

        List<PlacesToFun> all = placesToFunRepository.findAll();

        assertThat(all).hasSizeGreaterThanOrEqualTo(2);
    }

    // Util
    private PlacesToFun buildSamplePlace(String name) {
        PlacesToFun place = new PlacesToFun();
        place.setName(name);
        place.setAddress("123 Main St");
        place.setLatitude(5.5);
        place.setLongitude(6.6);
        place.setOpenTime(LocalTime.of(9, 0));
        place.setCloseTime(LocalTime.of(21, 0));
        place.setPayment(Payment.CARD);
        place.setStatus(Status.OPEN);
        place.setCreator(creator);
        place.setPlaceCategoryToFun(PlaceCategoryToFun.PARK);
        place.setSizePark(SizePark.SMALL);
        place.setHaveGames(true);
        return place;
    }
}
