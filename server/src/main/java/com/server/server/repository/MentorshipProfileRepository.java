package com.server.server.repository;

import com.server.server.model.MentorshipProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorshipProfileRepository extends JpaRepository<MentorshipProfile, Long> {
    Optional<MentorshipProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
