package com.Pitstop.PitstopServix.Repositories;

import com.Pitstop.PitstopServix.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
