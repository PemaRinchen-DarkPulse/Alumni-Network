package com.server.server.controller;

import com.server.server.dto.MentorDTO;
import com.server.server.dto.MentorshipProfileDTO;
import com.server.server.dto.MentorshipProfileRequest;
import com.server.server.dto.MentorshipRequestDTO;
import com.server.server.dto.MentorshipRequestRequest;
import com.server.server.service.MentorshipProfileService;
import com.server.server.service.MentorshipRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mentorship")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class MentorshipController {
    
    private final MentorshipProfileService mentorshipProfileService;
    private final MentorshipRequestService mentorshipRequestService;
    
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
    
    @GetMapping("/mentors")
    public ResponseEntity<Map<String, Object>> getAllMentors(
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long currentUserId) {
        log.info("Received request to get all mentors with filters - expertise: {}, topic: {}, search: {}, currentUserId: {}", 
                 expertise, topic, search, currentUserId);
        
        try {
            List<MentorDTO> mentors = mentorshipProfileService.getAllPublishedMentors(expertise, topic, search, currentUserId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", mentors,
                "count", mentors.size()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching mentors: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch mentors: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> createMentorshipRequest(@RequestBody MentorshipRequestRequest request) {
        log.info("Received mentorship request from mentee {} to mentor {}", 
                 request.getMenteeId(), request.getMentorId());
        
        try {
            MentorshipRequestDTO mentorshipRequest = mentorshipRequestService.createRequest(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", mentorshipRequest,
                "message", "Mentorship request sent successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating mentorship request: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/requests/mentee/{menteeId}")
    public ResponseEntity<Map<String, Object>> getMenteeRequests(@PathVariable Long menteeId) {
        log.info("Fetching mentorship requests for mentee: {}", menteeId);
        
        try {
            List<MentorshipRequestDTO> requests = mentorshipRequestService.getRequestsByMentee(menteeId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", requests,
                "count", requests.size()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching mentee requests: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch requests: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/requests/mentor/{mentorId}")
    public ResponseEntity<Map<String, Object>> getMentorRequests(
            @PathVariable Long mentorId,
            @RequestParam(required = false) String status) {
        log.info("Fetching mentorship requests for mentor: {} with status: {}", mentorId, status);
        
        try {
            List<MentorshipRequestDTO> requests = mentorshipRequestService.getRequestsByMentor(mentorId, status);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", requests,
                "count", requests.size()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching mentor requests: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch requests: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/requests/{requestId}/status")
    public ResponseEntity<Map<String, Object>> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> payload) {
        log.info("Updating mentorship request {} status", requestId);
        
        try {
            String status = payload.get("status");
            MentorshipRequestDTO request = mentorshipRequestService.updateRequestStatus(requestId, status);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", request,
                "message", "Request status updated successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating request status: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to update status: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
