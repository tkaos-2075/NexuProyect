package com.nexu.PlacesToFun.infrastructure;

import com.nexu.Places.infrastructure.PlacesRepository;
import com.nexu.PlacesToFun.domain.PlacesToFun;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface PlacesToFunRepository extends PlacesRepository<PlacesToFun> {
    List<PlacesToFun> findByOpenTimeBeforeAndCloseTimeAfter(LocalTime open, LocalTime close);
}
