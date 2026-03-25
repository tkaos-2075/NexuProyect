package com.nexu.Labels.domain;

import com.nexu.Places.domain.Places;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Labels {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(nullable = false)
    private String color;

    @Enumerated(EnumType.STRING)
    private LabelsStatus status= LabelsStatus.ACTIVE;

    @ManyToMany
    @JoinTable(
            name = "place_labels",
            joinColumns = @JoinColumn(name = "labels_id"),
            inverseJoinColumns = @JoinColumn(name = "place_id")
    )
    private Set<Places> places;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Labels)) return false;
        Labels label = (Labels) o;
        return id != null && id.equals(label.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
