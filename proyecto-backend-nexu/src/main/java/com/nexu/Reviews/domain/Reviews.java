package com.nexu.Reviews.domain;

import com.nexu.Pictures.domain.Pictures;
import com.nexu.Users.domain.Users;
import com.nexu.Places.domain.Places;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int likes;

    @Column(nullable = false)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int rating; // score or stars, from 1 to 5
    
    // Relationships

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "place_id", nullable = false)
    private Places place;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pictures> pictures = new ArrayList<>();


    @PrePersist
    public void setCreationDate() {
        this.createdAt = LocalDateTime.now();
    }
}