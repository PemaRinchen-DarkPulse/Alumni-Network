package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipProfileRequest {
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
}
