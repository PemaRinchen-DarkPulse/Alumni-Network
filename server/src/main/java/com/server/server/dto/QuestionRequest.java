package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {
    private String title;
    private String description;
    private String category;
    private List<String> tags;
    private boolean isAnonymous;
    private Long authorId;
    private String authorName;
}
