package org.example.competencymanagementsystem.repository;

import org.example.competencymanagementsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query(value = """
        SELECT u
        FROM User u
        WHERE u.password IS NOT NULL
        """)
    List<User> findAllAuthenticated();
}
