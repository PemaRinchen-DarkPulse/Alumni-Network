package com.server.server.controller;

import com.server.server.dto.MentorshipProfileDTO;
import com.server.server.dto.MentorshipProfileRequest;
import com.server.server.service.MentorshipProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mentorship")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class MentorshipController {
    
    private final MentorshipProfileService mentorshipProfileService;
    
    @PostMapping("/draft")
    public ResponseEntity<Map<String, Object>> saveDraft(@RequestBody MentorshipProfileRequest request) {
        log.info("Received request to save draft for user: {}", request.getUserId());
        
        try {
            MentorshipProfileDTO profile = mentorshipProfileService.saveDraft(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", profile,
                "message", "Draft saved successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving draft: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to save draft: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/publish")
    public ResponseEntity<Map<String, Object>> publish(@RequestBody MentorshipProfileRequest request) {
        log.info("Received request to publish profile for user: {}", request.getUserId());
        
        try {
            MentorshipProfileDTO profile = mentorshipProfileService.publish(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", profile,
                "message", "Profile published successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing profile: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish profile: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/profile/{userId}")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable Long userId) {
        log.info("Received request to get profile for user: {}", userId);
        
        try {
            MentorshipProfileDTO profile = mentorshipProfileService.getProfileByUserId(userId);
            
            if (profile != null) {
                Map<String, Object> response = Map.of(
                    "success", true,
                    "data", profile
                );
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = Map.of(
                    "success", false,
                    "message", "Profile not found"
                );
                
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            log.error("Error fetching profile: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch profile: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/profile/{userId}")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @PathVariable Long userId,
            @RequestBody MentorshipProfileRequest request) {
        log.info("Received request to update profile for user: {}", userId);
        
        try {
            MentorshipProfileDTO profile = mentorshipProfileService.updateProfile(userId, request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", profile,
                "message", "Profile updated successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating profile: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to update profile: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
