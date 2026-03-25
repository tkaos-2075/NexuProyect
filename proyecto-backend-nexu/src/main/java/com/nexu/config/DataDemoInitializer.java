package com.nexu.config;

import com.nexu.Labels.domain.Labels;
import com.nexu.Labels.domain.LabelsStatus;
import com.nexu.Labels.infrastructure.LabelsRepository;
import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import com.nexu.Users.domain.Users;
import com.nexu.Users.infrastructure.UsersRepository;
import com.nexu.Places.domain.enums.Payment;
import com.nexu.Places.domain.enums.Status;
import com.nexu.PlacesToEat.domain.PlacesToEat;
import com.nexu.PlacesToEat.domain.enums.PlaceCategoryToEat;
import com.nexu.PlacesToEat.domain.enums.TypeRestaurant;
import com.nexu.PlacesToEat.infrastructure.PlacesToEatRepository;
import com.nexu.PlacesToFun.domain.PlacesToFun;
import com.nexu.PlacesToFun.domain.enums.PlaceCategoryToFun;
import com.nexu.PlacesToFun.domain.enums.SizePark;
import com.nexu.PlacesToFun.infrastructure.PlacesToFunRepository;
import com.nexu.Reviews.domain.Reviews;
import com.nexu.Reviews.infrastructure.ReviewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Configuration
@RequiredArgsConstructor
public class DataDemoInitializer {
    private final LabelsRepository labelsRepository;
    private final UsersRepository usersRepository;
    private final PlacesToEatRepository placesToEatRepository;
    private final PlacesToFunRepository placesToFunRepository;
    private final ReviewsRepository reviewsRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Transactional
    public CommandLineRunner initDemoData() {
        return args -> {
            // 1) Etiquetas
            Labels l1 = labelsRepository.findByName("Económico").orElseGet(() -> labelsRepository.save(new Labels(null, "Económico", "Opciones con precios accesibles", "#1ABC9C", LabelsStatus.ACTIVE, new HashSet<>())));
            Labels l2 = labelsRepository.findByName("Familiar").orElseGet(() -> labelsRepository.save(new Labels(null, "Familiar", "Ideal para reuniones familiares", "#3498DB", LabelsStatus.ACTIVE, new HashSet<>())));
            Labels l3 = labelsRepository.findByName("Romántico").orElseGet(() -> labelsRepository.save(new Labels(null, "Romántico", "Ambiente íntimo para parejas", "#E74C3C", LabelsStatus.ACTIVE, new HashSet<>())));
            Labels l4 = labelsRepository.findByName("Cultural").orElseGet(() -> labelsRepository.save(new Labels(null, "Cultural", "Experiencia de cultura local", "#9B59B6", LabelsStatus.ACTIVE, new HashSet<>())));
            Labels l5 = labelsRepository.findByName("Aventurero").orElseGet(() -> labelsRepository.save(new Labels(null, "Aventurero", "Actividades para amantes de la aventura", "#F1C40F", LabelsStatus.ACTIVE, new HashSet<>())));

            // 2) Usuarios
            Users u1 = usersRepository.findByEmail("alice@example.com").orElseGet(() -> usersRepository.save(new Users(null, UserRole.USER, UserStatus.ACTIVE, passwordEncoder.encode("password1"), "alice@example.com", "Alice", new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>())));
            Users u2 = usersRepository.findByEmail("bob@example.com").orElseGet(() -> usersRepository.save(new Users(null, UserRole.USER, UserStatus.ACTIVE, passwordEncoder.encode("password2"), "bob@example.com", "Bob", new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>())));
            Users u3 = usersRepository.findByEmail("charlie@example.com").orElseGet(() -> usersRepository.save(new Users(null, UserRole.USER, UserStatus.ACTIVE, passwordEncoder.encode("password3"), "charlie@example.com", "Charlie", new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>())));
            Users u4 = usersRepository.findByEmail("daniel@example.com").orElseGet(() -> usersRepository.save(new Users(null, UserRole.USER, UserStatus.ACTIVE, passwordEncoder.encode("password4"), "daniel@example.com", "Daniel", new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>())));
            Users u5 = usersRepository.findByEmail("eva@example.com").orElseGet(() -> usersRepository.save(new Users(null, UserRole.USER, UserStatus.ACTIVE, passwordEncoder.encode("password5"), "eva@example.com", "Eva", new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>())));

            // 3) Lugares para comer (PlacesToEat)
            PlacesToEat p1 = placesToEatRepository.findByName("La Trattoria Moderna").orElseGet(() -> {
                PlacesToEat p = new PlacesToEat();
                p.setName("La Trattoria Moderna");
                p.setAddress("Jr. Gregorio Escobedo 120, Jesús María");
                p.setDescription("Cocina italiana contemporánea…");
                p.setPayment(Payment.CARD);
                p.setLatitude(-12.071000);
                p.setLongitude(-77.043000);
                p.setOpenTime(LocalTime.parse("12:00"));
                p.setCloseTime(LocalTime.parse("23:00"));
                p.setQualification(0.0);
                p.setStatus(Status.OPEN);
                p.setWifi(true);
                p.setCreator(u1);
                p.setPriceRange("$$$");
                p.setEstimatedPrice(45.0);
                p.setCapacity(50);
                p.setPlaceCategoryToEat(PlaceCategoryToEat.RESTAURANT);
                p.setMenu("https://latrattoriamoderna.pe/menu");
                p.setTypeRestaurant(TypeRestaurant.CRIOLLO);
                p.setDelivery(true);
                p.setLabels(new HashSet<>(Arrays.asList(l3, l4)));
                return placesToEatRepository.save(p);
            });
            PlacesToEat p2 = placesToEatRepository.findByName("El Buen Sabor").orElseGet(() -> {
                PlacesToEat p = new PlacesToEat();
                p.setName("El Buen Sabor");
                p.setAddress("Av. La Mar 330, Miraflores");
                p.setDescription("Comida peruana tradicional…");
                p.setPayment(Payment.CASH);
                p.setLatitude(-12.121200);
                p.setLongitude(-77.030000);
                p.setOpenTime(LocalTime.parse("11:00"));
                p.setCloseTime(LocalTime.parse("22:00"));
                p.setQualification(0.0);
                p.setStatus(Status.OPEN);
                p.setWifi(false);
                p.setCreator(u3);
                p.setPriceRange("$$");
                p.setEstimatedPrice(30.0);
                p.setCapacity(40);
                p.setPlaceCategoryToEat(PlaceCategoryToEat.RESTAURANT);
                p.setMenu("https://elbuen­sabor.pe/menu");
                p.setTypeRestaurant(TypeRestaurant.CRIOLLO);
                p.setDelivery(true);
                p.setLabels(new HashSet<>(Arrays.asList(l1, l2)));
                return placesToEatRepository.save(p);
            });
            PlacesToEat p3 = placesToEatRepository.findByName("Sushi Zento").orElseGet(() -> {
                PlacesToEat p = new PlacesToEat();
                p.setName("Sushi Zento");
                p.setAddress("Av. Arequipa 456, Lince");
                p.setDescription("Rollos de sushi frescos…");
                p.setPayment(Payment.CARD);
                p.setLatitude(-12.079000);
                p.setLongitude(-77.040000);
                p.setOpenTime(LocalTime.parse("13:00"));
                p.setCloseTime(LocalTime.parse("22:30"));
                p.setQualification(0.0);
                p.setStatus(Status.OPEN);
                p.setWifi(false);
                p.setCreator(u3);
                p.setPriceRange("$$$");
                p.setEstimatedPrice(55.0);
                p.setCapacity(35);
                p.setPlaceCategoryToEat(PlaceCategoryToEat.RESTAURANT);
                p.setMenu("https://sushizento.pe/menu");
                p.setTypeRestaurant(TypeRestaurant.SELVATICO);
                p.setDelivery(false);
                p.setLabels(new HashSet<>(Arrays.asList(l3, l5)));
                return placesToEatRepository.save(p);
            });
            PlacesToEat p4 = placesToEatRepository.findByName("Cevichería Oceanía").orElseGet(() -> {
                PlacesToEat p = new PlacesToEat();
                p.setName("Cevichería Oceanía");
                p.setAddress("Malecón de Miraflores 234, Miraflores");
                p.setDescription("Mariscos frescos y ceviches…");
                p.setPayment(Payment.CARD);
                p.setLatitude(-12.122000);
                p.setLongitude(-77.027000);
                p.setOpenTime(LocalTime.parse("12:00"));
                p.setCloseTime(LocalTime.parse("23:00"));
                p.setQualification(0.0);
                p.setStatus(Status.OPEN);
                p.setWifi(false);
                p.setCreator(u4);
                p.setPriceRange("$$");
                p.setEstimatedPrice(35.0);
                p.setCapacity(45);
                p.setPlaceCategoryToEat(PlaceCategoryToEat.RESTAURANT);
                p.setMenu("https://cevicheriaoceania.pe/menu");
                p.setTypeRestaurant(TypeRestaurant.MARISCO);
                p.setDelivery(true);
                p.setLabels(new HashSet<>(Arrays.asList(l4, l5)));
                return placesToEatRepository.save(p);
            });
            PlacesToEat p5 = placesToEatRepository.findByName("Veggie Delight").orElseGet(() -> {
                PlacesToEat p = new PlacesToEat();
                p.setName("Veggie Delight");
                p.setAddress("Av. Salaverry 890, Jesús María");
                p.setDescription("Opciones 100% veganas y saludables.");
                p.setPayment(Payment.CARD);
                p.setLatitude(-12.079500);
                p.setLongitude(-77.048000);
                p.setOpenTime(LocalTime.parse("10:00"));
                p.setCloseTime(LocalTime.parse("21:00"));
                p.setQualification(0.0);
                p.setStatus(Status.OPEN);
                p.setWifi(true);
                p.setCreator(u5);
                p.setPriceRange("$$");
                p.setEstimatedPrice(28.0);
                p.setCapacity(30);
                p.setPlaceCategoryToEat(PlaceCategoryToEat.RESTAURANT);
                p.setMenu("https://veggiedelight.pe/menu");
                p.setTypeRestaurant(TypeRestaurant.CRIOLLO);
                p.setDelivery(true);
                p.setLabels(new HashSet<>(Arrays.asList(l1, l4)));
                return placesToEatRepository.save(p);
            });

            // 4) Lugares para diversión (PlacesToFun) - como no hay findByName, solo crear si no existe uno con mismo nombre y creador
            // (puedes agregar un método personalizado si lo necesitas, aquí solo ejemplo simple)
            if (placesToFunRepository.count() == 0) {
                PlacesToFun f1 = new PlacesToFun();
                f1.setName("Cine Plaza Real");
                f1.setAddress("Av. Larco 450, Miraflores");
                f1.setDescription("Sala de cine con 3D e IMAX.");
                f1.setPayment(Payment.CARD);
                f1.setLatitude(-12.121500);
                f1.setLongitude(-77.027500);
                f1.setOpenTime(LocalTime.parse("10:00"));
                f1.setCloseTime(LocalTime.parse("23:59"));
                f1.setQualification(0.0);
                f1.setStatus(Status.OPEN);
                f1.setWifi(false);
                f1.setCreator(u1);
                f1.setPriceRange("$$");
                f1.setEstimatedPrice(15.0);
                f1.setCapacity(300);
                f1.setPlaceCategoryToFun(PlaceCategoryToFun.GAMES);
                f1.setGames(Arrays.asList("3D", "IMAX"));
                f1.setPriceFicha(15.0);
                f1.setHaveGames(true);
                f1.setLabels(new HashSet<>(Arrays.asList(l2, l4)));
                PlacesToFun f2 = new PlacesToFun();
                f2.setName("Pista de Hielo Downtown");
                f2.setAddress("Av. Brasil 123, Cercado de Lima");
                f2.setDescription("Patinaje sobre hielo con coach.");
                f2.setPayment(Payment.CARD);
                f2.setLatitude(-12.058000);
                f2.setLongitude(-77.080000);
                f2.setOpenTime(LocalTime.parse("08:00"));
                f2.setCloseTime(LocalTime.parse("22:00"));
                f2.setQualification(0.0);
                f2.setStatus(Status.OPEN);
                f2.setWifi(false);
                f2.setCreator(u4);
                f2.setPriceRange("$$");
                f2.setEstimatedPrice(20.0);
                f2.setCapacity(100);
                f2.setPlaceCategoryToFun(PlaceCategoryToFun.PARK);
                f2.setSizePark(SizePark.REGULAR);
                f2.setPriceFicha(20.0);
                f2.setHaveGames(true);
                f2.setGames(Arrays.asList("Patinaje"));
                f2.setLabels(new HashSet<>(Arrays.asList(l1, l5)));
                PlacesToFun f3 = new PlacesToFun();
                f3.setName("Sala de Escape Mystery");
                f3.setAddress("Calle del Engaño 321, Barranco");
                f3.setDescription("Escape room temático de misterio.");
                f3.setPayment(Payment.CASH);
                f3.setLatitude(-12.142000);
                f3.setLongitude(-77.021000);
                f3.setOpenTime(LocalTime.parse("14:00"));
                f3.setCloseTime(LocalTime.parse("22:00"));
                f3.setQualification(0.0);
                f3.setStatus(Status.OPEN);
                f3.setWifi(false);
                f3.setCreator(u3);
                f3.setPriceRange("$$");
                f3.setEstimatedPrice(30.0);
                f3.setCapacity(20);
                f3.setPlaceCategoryToFun(PlaceCategoryToFun.GAMES);
                f3.setGames(Arrays.asList("Escape Room"));
                f3.setPriceFicha(30.0);
                f3.setHaveGames(true);
                f3.setLabels(new HashSet<>(Arrays.asList(l3, l5)));
                PlacesToFun f4 = new PlacesToFun();
                f4.setName("Bar de Karaoke La Noche");
                f4.setAddress("Jr. Puno 789, Centro Histórico");
                f4.setDescription("Karaoke y música en vivo hasta tarde.");
                f4.setPayment(Payment.CARD);
                f4.setLatitude(-12.046400);
                f4.setLongitude(-77.042800);
                f4.setOpenTime(LocalTime.parse("18:00"));
                f4.setCloseTime(LocalTime.parse("04:00"));
                f4.setQualification(0.0);
                f4.setStatus(Status.OPEN);
                f4.setWifi(true);
                f4.setCreator(u4);
                f4.setPriceRange("$$");
                f4.setEstimatedPrice(25.0);
                f4.setCapacity(80);
                f4.setPlaceCategoryToFun(PlaceCategoryToFun.GAMES);
                f4.setGames(Arrays.asList("Karaoke"));
                f4.setPriceFicha(10.0);
                f4.setHaveGames(true);
                f4.setLabels(new HashSet<>(Arrays.asList(l2, l3)));
                PlacesToFun f5 = new PlacesToFun();
                f5.setName("Parque Trampolines SkyJump");
                f5.setAddress("Av. Javier Prado 550, San Isidro");
                f5.setDescription("Trampolines y salto libre para todos.");
                f5.setPayment(Payment.CASH);
                f5.setLatitude(-12.094000);
                f5.setLongitude(-77.042200);
                f5.setOpenTime(LocalTime.parse("10:00"));
                f5.setCloseTime(LocalTime.parse("20:00"));
                f5.setQualification(0.0);
                f5.setStatus(Status.OPEN);
                f5.setWifi(false);
                f5.setCreator(u5);
                f5.setPriceRange("$$");
                f5.setEstimatedPrice(15.0);
                f5.setCapacity(150);
                f5.setPlaceCategoryToFun(PlaceCategoryToFun.PARK);
                f5.setSizePark(SizePark.BIG);
                f5.setPriceFicha(15.0);
                f5.setHaveGames(true);
                f5.setGames(Arrays.asList("Trampolines"));
                f5.setLabels(new HashSet<>(Arrays.asList(l1, l2)));
                placesToFunRepository.saveAll(Arrays.asList(f1, f2, f3, f4, f5));
            }

            // 5) Reviews (solo si no existen para ese usuario y lugar)
            if (reviewsRepository.count() == 0) {
                Reviews r1 = new Reviews();
                r1.setPlace(p1); r1.setUser(u5);
                r1.setComment("La pasta al pesto estaba exquisita y el servicio muy atento.");
                r1.setRating(5); r1.setLikes(0);
                r1.setCreatedAt(LocalDateTime.now());
                Reviews r2 = new Reviews();
                r2.setPlace(p2); r2.setUser(u4);
                r2.setComment("El ceviche estuvo un poco salado, pero el ambiente es muy familiar.");
                r2.setRating(4); r2.setLikes(0);
                r2.setCreatedAt(LocalDateTime.now());
                Reviews r3 = new Reviews();
                r3.setPlace(p3); r3.setUser(u3);
                r3.setComment("Rollos frescos y creativos, aunque la porción es algo pequeña para el precio.");
                r3.setRating(4); r3.setLikes(0);
                r3.setCreatedAt(LocalDateTime.now());
                Reviews r4 = new Reviews();
                r4.setPlace(p4); r4.setUser(u4);
                r4.setComment("Mariscos frescos y presentación impecable, perfecto para aventureros.");
                r4.setRating(5); r4.setLikes(0);
                r4.setCreatedAt(LocalDateTime.now());
                Reviews r5 = new Reviews();
                r5.setPlace(p5); r5.setUser(u5);
                r5.setComment("Gran variedad vegana, precios justos y ambiente acogedor.");
                r5.setRating(5); r5.setLikes(0);
                r5.setCreatedAt(LocalDateTime.now());
                reviewsRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5));
            }
        };
    }
}