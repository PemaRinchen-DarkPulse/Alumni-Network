package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String location;
    private String meetingLink;
    private Boolean isVirtual;
    private String visibility;
    private Integer maxAttendees;
    private String bannerImageUrl;
    private Long createdBy;
    private String status;
}
