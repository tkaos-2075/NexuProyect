package com.nexu.Places.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.nexu.Places.domain.enums.*;
import com.nexu.Labels.domain.Labels;
import com.nexu.Pictures.domain.Pictures;
import com.nexu.Plans.domain.Plans;
import com.nexu.Reviews.domain.Reviews;
import com.nexu.Users.domain.Users;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Inheritance(strategy = InheritanceType.JOINED)
@Entity
@Data
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = Places.class)
@Table(name = "places")
public class Places {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Payment payment;

    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime openTime;

    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime closeTime;

    @Column(nullable = false)
    private Status status;

    private Boolean wifi;

    private double qualification;

    @Size(max = 500)
    private String description;

    private String priceRange;

    private double estimatedPrice;

    private Integer capacity;

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pictures> pictures = new ArrayList<>();


    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL,  orphanRemoval = true)
    private Set<Reviews> reviews;

    @ManyToOne(optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private Users creator;


    @ManyToMany(mappedBy = "favorites")
    private Set<Users> favoritedBy;

    @ManyToMany(mappedBy = "places")
    private Set<Plans> plans = new HashSet<>();

    @ManyToMany(mappedBy = "places", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Labels> labels;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Places)) return false;
        Places place = (Places) o;
        return id != null && id.equals(place.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}