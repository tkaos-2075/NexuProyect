package com.nexu.Reviews.infrastructure;

import com.nexu.Reviews.domain.Reviews;
import com.nexu.Users.domain.Users;
import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.Places.domain.enums.Payment;
import com.nexu.Places.domain.enums.Status;
import com.nexu.PlacesToEat.domain.PlacesToEat;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.domain.enums.TypeCoffee;
import com.nexu.PlacesToEat.infrastructure.PlacesToEatRepository;
import com.nexu.config.PostgresTestContainerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@Import(PostgresTestContainerConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ReviewsRepositoryTest {

    @Autowired
    private ReviewsRepository reviewsRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PlacesToEatRepository placesToEatRepository;

    private Users user;
    private PlacesToEat place;

    @BeforeEach
    void setup() {
        user = new Users();
        user.setEmail("reviewer@test.com");
        user.setPassword("secure123");
        user.setName("Reviewer");
        user.setRole(UserRole.VIEWER);
        user.setStatus(UserStatus.ACTIVE);
        usersRepository.save(user);

        place = new PlacesToEat();
        place.setAddress("Av. Review 123");
        place.setName("Review Café");
        place.setLatitude(10.0);
        place.setLongitude(20.0);
        place.setOpenTime(LocalTime.of(8, 0));
        place.setCloseTime(LocalTime.of(18, 0));
        place.setCreator(user);
        place.setStatus(Status.OPEN);
        place.setPayment(Payment.CASH);
        place.setPlaceCategoryToEat(PlaceCategoryToEat.COFFEE);
        place.setTypeCoffee(TypeCoffee.TRADICIONAL);
        place.setDeliveryCoffee(true);
        placesToEatRepository.save(place);
    }

    @Test
    void shouldSaveAndRetrieveReview() {
        Reviews review = new Reviews();
        review.setComment("Excelente servicio");
        review.setRating(5);
        review.setLikes(3);
        review.setUser(user);
        review.setPlace(place);

        Reviews saved = reviewsRepository.save(review);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUser()).isEqualTo(user);
        assertThat(saved.getPlace()).isEqualTo(place);
    }

    @Test
    void shouldFindReviewsByUser() {
        Reviews review = new Reviews();
        review.setComment("Muy bueno");
        review.setRating(4);
        review.setLikes(1);
        review.setUser(user);
        review.setPlace(place);
        reviewsRepository.save(review);

        List<Reviews> byUser = reviewsRepository.findByUserId(user.getId());
        assertThat(byUser).hasSize(1);
        assertThat(byUser.get(0).getComment()).isEqualTo("Muy bueno");
    }

    @Test
    void shouldFindReviewsByPlace() {
        Reviews review = new Reviews();
        review.setComment("Recomendado");
        review.setRating(5);
        review.setLikes(2);
        review.setUser(user);
        review.setPlace(place);
        reviewsRepository.save(review);

        List<Reviews> byPlace = reviewsRepository.findByPlaceId(place.getId());
        assertThat(byPlace).hasSize(1);
        assertThat(byPlace.get(0).getRating()).isEqualTo(5);
    }
}
