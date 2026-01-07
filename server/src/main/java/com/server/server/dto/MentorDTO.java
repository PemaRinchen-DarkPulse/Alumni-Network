package com.server.server.dto;

import com.server.server.model.MentorshipProfile;
import com.server.server.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorDTO {
    // Mentorship Profile fields
    private Long profileId;
    private String professionalHeadline;
    private String bio;
    private List<String> expertise;
    private List<String> selectedTopics;
    private List<String> otherTopics;
    private Boolean openForBookings;
    private String maxHoursPerMonth;
    private String timezone;
    private String status;
    private LocalDateTime profileCreatedAt;
    private LocalDateTime profileUpdatedAt;
    
    // User fields
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String batch;
    
    /**
     * Create MentorDTO from MentorshipProfile and User entities
     */
    public static MentorDTO fromEntities(MentorshipProfile profile, User user) {
        MentorDTO dto = new MentorDTO();
        
        // Set profile data
        dto.setProfileId(profile.getId());
        dto.setProfessionalHeadline(profile.getProfessionalHeadline());
        dto.setBio(profile.getBio());
        dto.setExpertise(profile.getExpertise());
        dto.setSelectedTopics(profile.getSelectedTopics());
        dto.setOtherTopics(profile.getOtherTopics());
        dto.setOpenForBookings(profile.getOpenForBookings());
        dto.setMaxHoursPerMonth(profile.getMaxHoursPerMonth());
        dto.setTimezone(profile.getTimezone());
        dto.setStatus(profile.getStatus().name().toLowerCase());
        dto.setProfileCreatedAt(profile.getCreatedAt());
        dto.setProfileUpdatedAt(profile.getUpdatedAt());
        
        // Set user data
        dto.setUserId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name().toLowerCase());
        dto.setBatch(user.getBatch());
        
        return dto;
    }
}
