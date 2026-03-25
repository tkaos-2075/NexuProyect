package com.nexu.Pictures.domain;

import com.nexu.Places.domain.Places;
import com.nexu.Users.domain.Users;
import com.nexu.Reviews.domain.Reviews;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pictures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    @Column(nullable = false, updatable = false)
    private LocalDateTime takenAt;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Places place;

    @ManyToOne
    @JoinColumn(name = "review_id")
    private Reviews review;

    @PrePersist
    @PreUpdate
    private void beforeSave() {
        this.takenAt = this.takenAt == null ? LocalDateTime.now() : this.takenAt;

        boolean placeSet = this.place != null;
        boolean reviewSet = this.review != null;

        if (placeSet == reviewSet) {
            throw new IllegalStateException("A picture must be associated with exactly one of: Place or Review.");
        }
    }

}