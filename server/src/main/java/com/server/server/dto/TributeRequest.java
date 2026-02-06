package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TributeRequest {
    
    private String teacherName;
    private String department;
    private String subject;
    private String yearsFrom;
    private String yearsTo;
    private String message;
    private Long authorId;
    private String authorName;
}
