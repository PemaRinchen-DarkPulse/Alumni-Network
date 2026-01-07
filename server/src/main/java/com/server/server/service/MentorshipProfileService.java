package com.server.server.service;

import com.server.server.dto.MentorDTO;
import com.server.server.dto.MentorshipProfileDTO;
import com.server.server.dto.MentorshipProfileRequest;
import com.server.server.model.MentorshipProfile;
import com.server.server.model.MentorshipRequest;
import com.server.server.model.User;
import com.server.server.repository.MentorshipProfileRepository;
import com.server.server.repository.MentorshipRequestRepository;
import com.server.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorshipProfileService {
    
    private final MentorshipProfileRepository mentorshipProfileRepository;
    private final UserRepository userRepository;
    private final MentorshipRequestRepository mentorshipRequestRepository;
    
    @Transactional
    public MentorshipProfileDTO saveDraft(MentorshipProfileRequest request) {
        log.info("Saving mentorship profile draft for user: {}", request.getUserId());
        
        Optional<MentorshipProfile> existingProfile = mentorshipProfileRepository.findByUserId(request.getUserId());
        
        MentorshipProfile profile;
        if (existingProfile.isPresent()) {
            profile = existingProfile.get();
            log.info("Updating existing draft for user: {}", request.getUserId());
        } else {
            profile = new MentorshipProfile();
            profile.setUserId(request.getUserId());
            log.info("Creating new draft for user: {}", request.getUserId());
        }
        
        updateProfileFromRequest(profile, request);
        profile.setStatus(MentorshipProfile.ProfileStatus.DRAFT);
        
        MentorshipProfile savedProfile = mentorshipProfileRepository.save(profile);
        log.info("Draft saved successfully with ID: {}", savedProfile.getId());
        
        return MentorshipProfileDTO.fromEntity(savedProfile);
    }
    
    @Transactional
    public MentorshipProfileDTO publish(MentorshipProfileRequest request) {
        log.info("Publishing mentorship profile for user: {}", request.getUserId());
        
        Optional<MentorshipProfile> existingProfile = mentorshipProfileRepository.findByUserId(request.getUserId());
        
        MentorshipProfile profile;
        if (existingProfile.isPresent()) {
            profile = existingProfile.get();
            log.info("Publishing existing profile for user: {}", request.getUserId());
        } else {
            profile = new MentorshipProfile();
            profile.setUserId(request.getUserId());
            log.info("Creating and publishing new profile for user: {}", request.getUserId());
        }
        
        updateProfileFromRequest(profile, request);
        profile.setStatus(MentorshipProfile.ProfileStatus.PUBLISHED);
        
        MentorshipProfile savedProfile = mentorshipProfileRepository.save(profile);
        log.info("Profile published successfully with ID: {}", savedProfile.getId());
        
        return MentorshipProfileDTO.fromEntity(savedProfile);
    }
    
    public MentorshipProfileDTO getProfileByUserId(Long userId) {
        log.info("Fetching mentorship profile for user: {}", userId);
        
        Optional<MentorshipProfile> profile = mentorshipProfileRepository.findByUserId(userId);
        
        if (profile.isPresent()) {
            log.info("Profile found for user: {}", userId);
            return MentorshipProfileDTO.fromEntity(profile.get());
        } else {
            log.info("No profile found for user: {}", userId);
            return null;
        }
    }
    
    @Transactional
    public MentorshipProfileDTO updateProfile(Long userId, MentorshipProfileRequest request) {
        log.info("Updating mentorship profile for user: {}", userId);
        
        MentorshipProfile profile = mentorshipProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));
        
        updateProfileFromRequest(profile, request);
        
        if (request.getStatus() != null) {
            try {
                profile.setStatus(MentorshipProfile.ProfileStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status provided: {}, keeping current status", request.getStatus());
            }
        }
        
        MentorshipProfile savedProfile = mentorshipProfileRepository.save(profile);
        log.info("Profile updated successfully with ID: {}", savedProfile.getId());
        
        return MentorshipProfileDTO.fromEntity(savedProfile);
    }
    
    private void updateProfileFromRequest(MentorshipProfile profile, MentorshipProfileRequest request) {
        profile.setProfessionalHeadline(request.getProfessionalHeadline());
        profile.setBio(request.getBio());
        profile.setExpertise(request.getExpertise());
        profile.setSelectedTopics(request.getSelectedTopics());
        profile.setOtherTopics(request.getOtherTopics());
        profile.setOpenForBookings(request.getOpenForBookings());
        profile.setMaxHoursPerMonth(request.getMaxHoursPerMonth());
        profile.setTimezone(request.getTimezone());
    }
    
    /**
     * Get all published mentorship profiles with user details
     * @param expertise Optional filter by expertise
     * @param topic Optional filter by topic
     * @param search Optional search in name, headline, or bio
     * @param currentUserId Optional current user ID to exclude mentors with existing requests
     * @return List of MentorDTO objects
     */
    public List<MentorDTO> getAllPublishedMentors(String expertise, String topic, String search, Long currentUserId) {
        log.info("Fetching all published mentorship profiles for user: {}", currentUserId);
        
        // Get all published profiles
        List<MentorshipProfile> publishedProfiles = mentorshipProfileRepository
                .findByStatus(MentorshipProfile.ProfileStatus.PUBLISHED);
        
        log.info("Found {} published profiles", publishedProfiles.size());
        
        // Convert to DTOs with user information
        List<MentorDTO> mentors = new ArrayList<>();
        
        for (MentorshipProfile profile : publishedProfiles) {
            Optional<User> userOpt = userRepository.findById(profile.getUserId());
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Only include verified alumni
                if (user.isEmailVerified() && user.getRole() == User.Role.ALUMNI) {
                    // Check if there's a pending or accepted request between current user and this mentor
                    // Note: Rejected requests should NOT filter out the mentor - user can request again with different topic
                    if (currentUserId != null) {
                        boolean hasExistingRequest = mentorshipRequestRepository
                                .existsByMenteeIdAndMentorIdAndStatus(currentUserId, user.getId(), MentorshipRequest.RequestStatus.PENDING) ||
                                mentorshipRequestRepository
                                .existsByMenteeIdAndMentorIdAndStatus(currentUserId, user.getId(), MentorshipRequest.RequestStatus.ACCEPTED);
                        
                        if (hasExistingRequest) {
                            log.debug("Skipping mentor {} - existing pending/accepted request found for user {}", user.getId(), currentUserId);
                            continue; // Skip this mentor
                        }
                    }
                    
                    MentorDTO mentor = MentorDTO.fromEntities(profile, user);
                    mentors.add(mentor);
                }
            } else {
                log.warn("User not found for profile: {}", profile.getId());
            }
        }
        
        // Apply filters
        List<MentorDTO> filteredMentors = mentors.stream()
                .filter(mentor -> {
                    // Filter by expertise
                    if (expertise != null && !expertise.isEmpty()) {
                        if (mentor.getExpertise() == null || 
                            !mentor.getExpertise().stream()
                                .anyMatch(exp -> exp.toLowerCase().contains(expertise.toLowerCase()))) {
                            return false;
                        }
                    }
                    
                    // Filter by topic
                    if (topic != null && !topic.isEmpty()) {
                        boolean topicMatch = false;
                        
                        if (mentor.getSelectedTopics() != null) {
                            topicMatch = mentor.getSelectedTopics().stream()
                                    .anyMatch(t -> t.toLowerCase().contains(topic.toLowerCase()));
                        }
                        
                        if (!topicMatch && mentor.getOtherTopics() != null) {
                            topicMatch = mentor.getOtherTopics().stream()
                                    .anyMatch(t -> t.toLowerCase().contains(topic.toLowerCase()));
                        }
                        
                        if (!topicMatch) {
                            return false;
                        }
                    }
                    
                    // Filter by search (name, headline, bio)
                    if (search != null && !search.isEmpty()) {
                        String searchLower = search.toLowerCase();
                        boolean matchesSearch = 
                            mentor.getName().toLowerCase().contains(searchLower) ||
                            (mentor.getProfessionalHeadline() != null && 
                             mentor.getProfessionalHeadline().toLowerCase().contains(searchLower)) ||
                            (mentor.getBio() != null && 
                             mentor.getBio().toLowerCase().contains(searchLower));
                        
                        if (!matchesSearch) {
                            return false;
                        }
                    }
                    
                    return true;
                })
                .collect(Collectors.toList());
        
        log.info("Returning {} mentors after filtering", filteredMentors.size());
        return filteredMentors;
    }
}
