package com.nexu.config;

import com.nexu.Users.domain.UserRole;
import com.nexu.Users.domain.UserStatus;
import com.nexu.Users.domain.Users;
import com.nexu.Users.infrastructure.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

//    solo para testeo
//    en el fronten se usaria el usuario viewer para aquellos usuarios que no realicen el logeo

    @Bean
    public CommandLineRunner initDefaultUsers() {
        return args -> {
            if (usersRepository.findByEmail("admin@nexu.com").isEmpty()) {
                Users admin = new Users();
                admin.setEmail("admin@nexu.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setName("Administrador");
                admin.setRole(UserRole.ADMIN);
                admin.setStatus(UserStatus.ACTIVE);
                usersRepository.save(admin);
                System.out.println("✔ Usuario admin creado por defecto.");
            }

            if (usersRepository.findByEmail("viewer@nexu.com").isEmpty()) {
                Users viewer = new Users();
                viewer.setEmail("viewer@nexu.com");
                viewer.setPassword(passwordEncoder.encode("viewer123"));
                viewer.setName("Usuario Viewer");
                viewer.setRole(UserRole.VIEWER); // Asegúrate de tener este rol en tu enum
                viewer.setStatus(UserStatus.ACTIVE);
                usersRepository.save(viewer);
                System.out.println("✔ Usuario viewer creado por defecto.");
            }
        };
    }

}
