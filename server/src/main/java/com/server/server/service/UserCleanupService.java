package com.server.server.service;

import com.server.server.model.User;
import com.server.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service responsible for cleaning up unverified user accounts that have expired.
 * Runs a scheduled task to automatically remove users who haven't verified their
 * email within 24 hours of registration.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserCleanupService {
    
    private final UserRepository userRepository;
    
    /**
     * Scheduled task that runs every hour to clean up expired unverified users.
     * The task finds all users where:
     * - emailVerified is false
     * - tokenExpiry is before the current time
     * 
     * Cron expression: "0 0 * * * *" means run at the start of every hour
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanupExpiredUnverifiedUsers() {
        log.info("Starting cleanup of expired unverified users");
        
        LocalDateTime currentTime = LocalDateTime.now();
        List<User> expiredUsers = userRepository.findUnverifiedUsersWithExpiredTokens(currentTime);
        
        if (expiredUsers.isEmpty()) {
            log.info("No expired unverified users found");
            return;
        }
        
        log.info("Found {} expired unverified user(s) to delete", expiredUsers.size());
        
        for (User user : expiredUsers) {
            try {
                log.debug("Deleting expired unverified user: {} (registered at: {}, token expired at: {})", 
                    user.getEmail(), 
                    user.getCreatedAt(),
                    user.getTokenExpiry()
                );
                userRepository.delete(user);
            } catch (Exception e) {
                log.error("Failed to delete expired unverified user: {}", user.getEmail(), e);
            }
        }
        
        log.info("Successfully cleaned up {} expired unverified user(s)", expiredUsers.size());
    }
}
