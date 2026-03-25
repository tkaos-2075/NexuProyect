package com.nexu.Users.domain;

import com.nexu.Places.domain.Places;
import com.nexu.Plans.domain.Plans;
import com.nexu.Reviews.domain.Reviews;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status=UserStatus.ACTIVE;

    @Column(nullable = false)
    private String password;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

//    relations

    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
    private Set<Plans> plans = new HashSet<>();

    @OneToMany(mappedBy = "creator", fetch = FetchType.LAZY)
    private Set<Places> placesCreated = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "favorites",
            joinColumns = @JoinColumn(name = "users_id"),
            inverseJoinColumns = @JoinColumn(name = "places_id")
    )
    private Set<Places> favorites = new HashSet<>();

    @OneToMany(mappedBy = "creator", fetch = FetchType.LAZY)
    private Set<Plans> createdPlans = new HashSet<>();;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Reviews> reviews = new HashSet<>();

    //    Devuelve los roles del usuario
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    //    se establece el email como nombre de usuario (identificador de cierta manera)
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Users)) return false;
        Users other = (Users) o;
        return id != null && id.equals(other.getId());
    }

    @Override
    public int hashCode() {
        return 31;
    }

}

