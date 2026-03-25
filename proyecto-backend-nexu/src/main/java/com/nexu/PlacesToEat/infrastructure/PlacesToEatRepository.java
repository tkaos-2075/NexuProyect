package com.nexu.PlacesToEat.infrastructure;

import com.nexu.Places.infrastructure.PlacesRepository;
import com.nexu.PlacesToEat.domain.PlacesToEat;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlacesToEatRepository extends PlacesRepository<PlacesToEat> {
    List<PlacesToEat> findByOpenTimeBeforeAndCloseTimeAfter(LocalTime open, LocalTime close);

    Optional<PlacesToEat> findByName(String name);
}
