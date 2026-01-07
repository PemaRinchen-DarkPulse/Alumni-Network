package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRequestRequest {
    private Long menteeId;
    private Long mentorId;
    private String topic;
    private String message;
}
