package com.server.server.service;

import com.server.server.dto.MentorshipProfileDTO;
import com.server.server.dto.MentorshipProfileRequest;
import com.server.server.model.MentorshipProfile;
import com.server.server.repository.MentorshipProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorshipProfileService {
    
    private final MentorshipProfileRepository mentorshipProfileRepository;
    
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
}
