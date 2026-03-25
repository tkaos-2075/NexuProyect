package com.nexu.Users.infrastructure;

import com.nexu.config.PostgresTestContainerConfig;
import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import com.nexu.Users.domain.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@Import(PostgresTestContainerConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UsersRepositoryTest {

    @Autowired
    private UsersRepository usersRepository;

    private Users adminUser;
    private Users regularUser;

    @BeforeEach
    void setUp() {
        usersRepository.deleteAll();

        adminUser = new Users();
        adminUser.setName("Admin User");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword("securePassword123");
        adminUser.setRole(UserRole.ADMIN);
        adminUser.setStatus(UserStatus.ACTIVE);

        regularUser = new Users();
        regularUser.setName("Regular User");
        regularUser.setEmail("user@example.com");
        regularUser.setPassword("userPassword123");
        regularUser.setRole(UserRole.USER);
        regularUser.setStatus(UserStatus.ACTIVE);

        usersRepository.saveAll(Set.of(adminUser, regularUser));
    }

    // Tests básicos de CRUD
    @Test
    void shouldSaveUser() {
        Users newUser = new Users();
        newUser.setName("New User");
        newUser.setEmail("new@example.com");
        newUser.setPassword("newPassword123");
        newUser.setRole(UserRole.VIEWER);
        newUser.setStatus(UserStatus.SUSPENDED);

        Users savedUser = usersRepository.save(newUser);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("new@example.com");
        assertThat(savedUser.getRole()).isEqualTo(UserRole.VIEWER);
    }

    @Test
    void shouldFindUserById() {
        Optional<Users> foundUser = usersRepository.findById(adminUser.getId());

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getName()).isEqualTo("Admin User");
        assertThat(foundUser.get().getRole()).isEqualTo(UserRole.ADMIN);
    }

    @Test
    void shouldFindAllUsers() {
        Set<Users> users = Set.copyOf(usersRepository.findAll());

        assertThat(users).hasSize(2);
        assertThat(users).extracting(Users::getEmail)
                .containsExactlyInAnyOrder("admin@example.com", "user@example.com");
    }

    @Test
    void shouldUpdateUser() {
        adminUser.setName("Updated Admin");
        adminUser.setStatus(UserStatus.INACTIVE);

        Users updatedUser = usersRepository.save(adminUser);

        assertThat(updatedUser.getName()).isEqualTo("Updated Admin");
        assertThat(updatedUser.getStatus()).isEqualTo(UserStatus.INACTIVE);
    }

    @Test
    void shouldDeleteUser() {
        usersRepository.delete(regularUser);

        Optional<Users> deletedUser = usersRepository.findById(regularUser.getId());
        assertThat(deletedUser).isEmpty();
    }

    // Tests para métodos específicos
    @Test
    void shouldFindByEmail() {
        Optional<Users> foundUser = usersRepository.findByEmail("user@example.com");

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("user@example.com");
        assertThat(foundUser.get().getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    void shouldCheckIfEmailExists() {
        boolean exists = usersRepository.existsByEmail("admin@example.com");

        assertThat(exists).isTrue();
    }

    @Test
    void shouldCheckIfEmailDoesNotExist() {
        boolean exists = usersRepository.existsByEmail("nonexistent@example.com");

        assertThat(exists).isFalse();
    }

    @Test
    void shouldFindByStatus() {
        Set<Users> activeUsers = Set.copyOf(usersRepository.findByStatus(UserStatus.ACTIVE));

        assertThat(activeUsers).hasSize(2);
        assertThat(activeUsers).extracting(Users::getStatus)
                .containsOnly(UserStatus.ACTIVE);
    }

    @Test
    void shouldFindByRole() {
        Set<Users> admins = Set.copyOf(usersRepository.findByRole(UserRole.ADMIN));

        assertThat(admins).hasSize(1);
        assertThat(admins.iterator().next().getEmail()).isEqualTo("admin@example.com");
    }

    // Tests para UserDetails implementation
    @Test
    void shouldImplementUserDetailsCorrectly() {
        Optional<Users> user = usersRepository.findByEmail("admin@example.com");

        assertThat(user).isPresent();
        assertThat(user.get().getAuthorities())
                .extracting("authority")
                .containsExactly("ADMIN");
        assertThat(user.get().getUsername()).isEqualTo("admin@example.com");
        assertThat(user.get().isAccountNonExpired()).isTrue();
        assertThat(user.get().isAccountNonLocked()).isTrue();
        assertThat(user.get().isCredentialsNonExpired()).isTrue();
        assertThat(user.get().isEnabled()).isTrue();
    }
}