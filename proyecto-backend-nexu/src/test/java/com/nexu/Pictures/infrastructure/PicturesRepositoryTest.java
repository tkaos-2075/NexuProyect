package com.nexu.Pictures.infrastructure;

import com.nexu.Pictures.domain.Pictures;
import com.nexu.Places.domain.enums.Payment;
import com.nexu.Places.domain.enums.Status;
import com.nexu.PlacesToEat.domain.PlacesToEat;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.domain.enums.TypeCoffee;
import com.nexu.PlacesToEat.infrastructure.PlacesToEatRepository;
import com.nexu.Reviews.domain.Reviews;
import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import com.nexu.Users.domain.Users;
import com.nexu.Reviews.infrastructure.ReviewsRepository;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.config.PostgresTestContainerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Testcontainers
@Import(PostgresTestContainerConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PicturesRepositoryTest {

    @Autowired
    private PicturesRepository picturesRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PlacesToEatRepository placesToEatRepository;

    @Autowired
    private ReviewsRepository reviewsRepository;

    private Users user;
    private PlacesToEat place;
    private Reviews review;

    @BeforeEach
    void setUp() {
        // 👤 Users
        user = new Users();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setName("Test User");
        user.setRole(UserRole.VIEWER);
        user.setStatus(UserStatus.ACTIVE);
        usersRepository.save(user);

        // 📍 Places (specific)
        place = new PlacesToEat();
        place.setAddress("123 Test St.");
        place.setName("Café Java");
        place.setLatitude(-34.6037);
        place.setLongitude(-58.3816);
        place.setPayment(Payment.CASH);
        place.setOpenTime(LocalTime.of(9, 0));
        place.setCloseTime(LocalTime.of(20, 0));
        place.setStatus(Status.CLOSE);
        place.setCreator(user);
        place.setPlaceCategoryToEat(PlaceCategoryToEat.COFFEE);
        place.setTypeCoffee(TypeCoffee.PETFRIENDLY);
        place.setDeliveryCoffee(true);

        placesToEatRepository.save(place);

        // ✍️ Reviews
        review = new Reviews();
        review.setComment("Excelente lugar");
        review.setRating(5);
        review.setLikes(0);
        review.setUser(user);
        review.setPlace(place);
        reviewsRepository.save(review);
    }

    @Test
    void shouldSavePictureWithPlaceOnly() {
        Pictures picture = new Pictures();
        picture.setUrl("image1.jpg");
        picture.setPlace(place);
        picture.setTakenAt(LocalDateTime.now());

        Pictures saved = picturesRepository.save(picture);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPlace()).isEqualTo(place);
        assertThat(saved.getReview()).isNull();
    }

    @Test
    void shouldSavePictureWithReviewOnly() {
        Pictures picture = new Pictures();
        picture.setUrl("image2.jpg");
        picture.setReview(review);
        picture.setTakenAt(LocalDateTime.now());

        Pictures saved = picturesRepository.save(picture);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getReview()).isEqualTo(review);
        assertThat(saved.getPlace()).isNull();
    }

    @Test
    void shouldThrowWhenPlaceAndReviewAreBothSet() {
        Pictures picture = new Pictures();
        picture.setUrl("image3.jpg");
        picture.setPlace(place);
        picture.setReview(review);
        picture.setTakenAt(LocalDateTime.now());

        InvalidDataAccessApiUsageException exception = assertThrows(
                InvalidDataAccessApiUsageException.class,
                () -> {
                    picturesRepository.save(picture);
                    picturesRepository.flush();
                }
        );

        assertTrue(exception.getCause() instanceof IllegalStateException);
        assertEquals(
                "A picture must be associated with exactly one of: Place or Review.",
                exception.getCause().getMessage()
        );
    }
}
