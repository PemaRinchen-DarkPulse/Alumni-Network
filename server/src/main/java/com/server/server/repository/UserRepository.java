package com.server.server.repository;

import com.server.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByVerificationToken(String token);
    
    Optional<User> findByResetToken(String token);
    
    @Query("SELECT u FROM User u WHERE u.emailVerified = false AND u.tokenExpiry < :currentTime")
    List<User> findUnverifiedUsersWithExpiredTokens(@Param("currentTime") LocalDateTime currentTime);
}
