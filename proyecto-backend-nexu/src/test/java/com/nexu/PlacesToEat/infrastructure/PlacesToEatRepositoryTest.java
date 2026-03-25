package com.nexu.PlacesToEat.infrastructure;

import com.nexu.PlacesToEat.domain.PlacesToEat;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.domain.enums.TypeCoffee;
import com.nexu.Places.domain.enums.Payment;
import com.nexu.Places.domain.enums.Status;
import com.nexu.PlacesToEat.domain.enums.TypeRestaurant;
import com.nexu.Users.domain.Users;
import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@Import(PostgresTestContainerConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PlacesToEatRepositoryTest {

    @Autowired
    private PlacesToEatRepository placesToEatRepository;

    @Autowired
    private UsersRepository usersRepository;

    private Users creator;

    @BeforeEach
    void setUp() {
        creator = new Users();
        creator.setName("Owner");
        creator.setEmail("owner@example.com");
        creator.setPassword("securepassword");
        creator.setStatus(UserStatus.ACTIVE);
        creator.setRole(UserRole.ADMIN);
        usersRepository.save(creator);
    }

    @Test
    void shouldSavePlaceToEat() {
        PlacesToEat place = new PlacesToEat();
        place.setName("Café Roma");
        place.setAddress("123 Roma St");
        place.setLatitude(10.0);
        place.setLongitude(20.0);
        place.setOpenTime(LocalTime.of(8, 0));
        place.setCloseTime(LocalTime.of(22, 0));
        place.setPayment(Payment.CASH);
        place.setStatus(Status.OPEN);
        place.setCreator(creator);
        place.setPlaceCategoryToEat(PlaceCategoryToEat.COFFEE);
        place.setTypeCoffee(TypeCoffee.PETFRIENDLY);
        place.setDeliveryCoffee(true);

        PlacesToEat saved = placesToEatRepository.save(place);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Café Roma");
    }

    @Test
    void shouldFindById() {
        PlacesToEat place = buildSamplePlace("Find Me");
        PlacesToEat saved = placesToEatRepository.save(place);

        Optional<PlacesToEat> found = placesToEatRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Find Me");
    }

    @Test
    void shouldFindByName() {
        PlacesToEat place = buildSamplePlace("ByName Test");
        placesToEatRepository.save(place);

        Optional<PlacesToEat> found = placesToEatRepository.findByName("ByName Test");

        assertThat(found).isPresent();
        assertThat(found.get().getAddress()).isEqualTo("123 Main St");
    }

    @Test
    void shouldUpdatePlace() {
        PlacesToEat place = buildSamplePlace("Update Me");
        PlacesToEat saved = placesToEatRepository.save(place);

        saved.setAddress("New Address");
        saved.setDeliveryCoffee(false);

        PlacesToEat updated = placesToEatRepository.save(saved);

        assertThat(updated.getAddress()).isEqualTo("New Address");
        assertThat(updated.getDeliveryCoffee()).isFalse();
    }

    @Test
    void shouldDeletePlace() {
        PlacesToEat place = buildSamplePlace("Delete Me");
        PlacesToEat saved = placesToEatRepository.save(place);
        Long id = saved.getId();

        placesToEatRepository.deleteById(id);

        Optional<PlacesToEat> deleted = placesToEatRepository.findById(id);
        assertThat(deleted).isEmpty();
    }

    @Test
    void shouldListAllPlaces() {
        PlacesToEat p1 = buildSamplePlace("Place 1");
        PlacesToEat p2 = buildSamplePlace("Place 2");

        placesToEatRepository.save(p1);
        placesToEatRepository.save(p2);

        List<PlacesToEat> allPlaces = placesToEatRepository.findAll();

        assertThat(allPlaces).hasSizeGreaterThanOrEqualTo(2);
    }

    // Util
    private PlacesToEat buildSamplePlace(String name) {
        PlacesToEat place = new PlacesToEat();
        place.setName(name);
        place.setAddress("123 Main St");
        place.setLatitude(1.1);
        place.setLongitude(2.2);
        place.setOpenTime(LocalTime.of(9, 0));
        place.setCloseTime(LocalTime.of(18, 0));
        place.setPayment(Payment.CARD);
        place.setStatus(Status.OPEN);
        place.setCreator(creator);
        place.setPlaceCategoryToEat(PlaceCategoryToEat.COFFEE);
        place.setTypeCoffee(TypeCoffee.TRADICIONAL);
        place.setDeliveryCoffee(true);
        return place;
    }

    @Test
    void shouldSaveAndFindPlacesToEat() {
        PlacesToEat place = new PlacesToEat();
        place.setName("PetFriendly Coffee");
        place.setAddress("123 Java St.");
        place.setLatitude(-34.6037);
        place.setLongitude(-58.3816);
        place.setOpenTime(LocalTime.of(8, 0));
        place.setCloseTime(LocalTime.of(20, 0));
        place.setPayment(Payment.CARD);
        place.setStatus(Status.OPEN);
        place.setCreator(creator);
        place.setPlaceCategoryToEat(PlaceCategoryToEat.COFFEE);
        place.setTypeCoffee(TypeCoffee.PETFRIENDLY);
        place.setDeliveryCoffee(true);
        place.setMenu("Café, Tés, Sandwiches");

        placesToEatRepository.save(place);

        List<PlacesToEat> allPlaces = placesToEatRepository.findAll();

        assertThat(allPlaces).hasSize(1);
        assertThat(allPlaces.get(0).getName()).isEqualTo("PetFriendly Coffee");
        assertThat(allPlaces.get(0).getPlaceCategoryToEat()).isEqualTo(PlaceCategoryToEat.COFFEE);
    }

}
