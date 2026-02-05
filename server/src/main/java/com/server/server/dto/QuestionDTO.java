package com.server.server.dto;

import com.server.server.model.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private List<String> tags;
    private Long authorId;
    private String authorName;
    private boolean isAnonymous;
    private String status;
    private int viewCount;
    private int answerCount;
    private int upvoteCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    
    public static QuestionDTO fromEntity(Question question) {
        return QuestionDTO.builder()
                .id(question.getId())
                .title(question.getTitle())
                .description(question.getDescription())
                .category(question.getCategory())
                .tags(question.getTags())
                .authorId(question.isAnonymous() ? null : question.getAuthorId())
                .authorName(question.isAnonymous() ? "Anonymous" : question.getAuthorName())
                .isAnonymous(question.isAnonymous())
                .status(question.getStatus().toString())
                .viewCount(question.getViewCount())
                .answerCount(question.getAnswerCount())
                .upvoteCount(question.getUpvoteCount())
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .publishedAt(question.getPublishedAt())
                .build();
    }
}
