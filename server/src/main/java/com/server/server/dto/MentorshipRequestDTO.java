package com.server.server.dto;

import com.server.server.model.MentorshipRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRequestDTO {
    private Long id;
    private Long menteeId;
    private Long mentorId;
    private String topic;
    private String message;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Mentee details
    private String menteeName;
    private String menteeEmail;
    private String menteeRole;
    private String menteeBatch;
    
    public static MentorshipRequestDTO fromEntity(MentorshipRequest request) {
        MentorshipRequestDTO dto = new MentorshipRequestDTO();
        dto.setId(request.getId());
        dto.setMenteeId(request.getMenteeId());
        dto.setMentorId(request.getMentorId());
        dto.setTopic(request.getTopic());
        dto.setMessage(request.getMessage());
        dto.setStatus(request.getStatus().name().toLowerCase());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        return dto;
    }
    
    public static MentorshipRequestDTO fromEntityWithMenteeDetails(MentorshipRequest request, com.server.server.model.User mentee) {
        MentorshipRequestDTO dto = fromEntity(request);
        if (mentee != null) {
            dto.setMenteeName(mentee.getName());
            dto.setMenteeEmail(mentee.getEmail());
            dto.setMenteeRole(mentee.getRole().name());
            dto.setMenteeBatch(mentee.getBatch());
        }
        return dto;
    }
}
