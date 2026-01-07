package com.server.server.dto;

import com.server.server.model.MentorshipProfile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipProfileDTO {
    private Long id;
    private Long userId;
    private String professionalHeadline;
    private String bio;
    private List<String> expertise;
    private List<String> selectedTopics;
    private List<String> otherTopics;
    private Boolean openForBookings;
    private String maxHoursPerMonth;
    private String timezone;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static MentorshipProfileDTO fromEntity(MentorshipProfile profile) {
        MentorshipProfileDTO dto = new MentorshipProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUserId());
        dto.setProfessionalHeadline(profile.getProfessionalHeadline());
        dto.setBio(profile.getBio());
        dto.setExpertise(profile.getExpertise());
        dto.setSelectedTopics(profile.getSelectedTopics());
        dto.setOtherTopics(profile.getOtherTopics());
        dto.setOpenForBookings(profile.getOpenForBookings());
        dto.setMaxHoursPerMonth(profile.getMaxHoursPerMonth());
        dto.setTimezone(profile.getTimezone());
        dto.setStatus(profile.getStatus().name().toLowerCase());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }
}
