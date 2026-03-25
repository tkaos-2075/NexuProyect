package com.nexu.Users.infrastructure;

import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import com.nexu.Users.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
    Optional<Users> findUsersByEmail(String email);
    boolean existsByEmail(String email);
    List<Users> findByStatus(UserStatus status);
    List<Users> findByRole(UserRole role);
}
