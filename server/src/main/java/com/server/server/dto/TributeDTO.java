package com.server.server.dto;

import com.server.server.model.Tribute;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TributeDTO {
    
    private Long id;
    private String teacherName;
    private String department;
    private String subject;
    private String yearsFrom;
    private String yearsTo;
    private String message;
    private Long authorId;
    private String authorName;
    private int likeCount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    
    public static TributeDTO fromEntity(Tribute tribute) {
        TributeDTO dto = new TributeDTO();
        dto.setId(tribute.getId());
        dto.setTeacherName(tribute.getTeacherName());
        dto.setDepartment(tribute.getDepartment());
        dto.setSubject(tribute.getSubject());
        dto.setYearsFrom(tribute.getYearsFrom());
        dto.setYearsTo(tribute.getYearsTo());
        dto.setMessage(tribute.getMessage());
        dto.setAuthorId(tribute.getAuthorId());
        dto.setAuthorName(tribute.getAuthorName());
        dto.setLikeCount(tribute.getLikeCount());
        dto.setStatus(tribute.getStatus().name());
        dto.setCreatedAt(tribute.getCreatedAt());
        dto.setUpdatedAt(tribute.getUpdatedAt());
        dto.setPublishedAt(tribute.getPublishedAt());
        
        return dto;
    }
}
