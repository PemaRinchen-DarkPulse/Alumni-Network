package com.server.server.dto;

import com.server.server.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String location;
    private String meetingLink;
    private Boolean isVirtual;
    private Boolean isFeatured;
    private String visibility;
    private Integer maxAttendees;
    private String bannerImageUrl;
    private Long createdBy;
    private String createdByName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int attendeeCount;
    private Set<UserDTO> attendees = new HashSet<>();
    
    public static EventDTO fromEntity(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDateTime(event.getStartDateTime());
        dto.setEndDateTime(event.getEndDateTime());
        dto.setLocation(event.getLocation());
        dto.setMeetingLink(event.getMeetingLink());
        dto.setIsVirtual(event.getIsVirtual());
        dto.setIsFeatured(event.getIsFeatured());
        dto.setVisibility(event.getVisibility().name().toLowerCase());
        dto.setMaxAttendees(event.getMaxAttendees());
        
        // Convert byte array to base64 string for JSON response
        if (event.getBannerImage() != null && event.getBannerImage().length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(event.getBannerImage());
            dto.setBannerImageUrl(base64Image);
        }
        
        dto.setCreatedBy(event.getCreatedBy());
        dto.setCreatedByName(event.getCreatedByName());
        dto.setStatus(event.getStatus().name().toLowerCase());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        dto.setAttendeeCount(event.getAttendeeCount());
        if (event.getAttendees() != null) {
            dto.setAttendees(event.getAttendees().stream().map(UserDTO::fromUser).collect(Collectors.toSet()));
        }
        return dto;
    }
}
