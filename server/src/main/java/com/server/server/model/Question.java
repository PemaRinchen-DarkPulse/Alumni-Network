package com.server.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 300)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(nullable = false)
    private String category;
    
    @ElementCollection
    @CollectionTable(name = "question_tags", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    @Column(nullable = false)
    private Long authorId;
    
    @Column
    private String authorName;
    
    @Column(nullable = false)
    private boolean isAnonymous = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionStatus status = QuestionStatus.DRAFT;
    
    @Column(nullable = false)
    private int viewCount = 0;
    
    @Column(nullable = false)
    private int answerCount = 0;
    
    @Column(nullable = false)
    private int upvoteCount = 0;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime publishedAt;
    
    public enum QuestionStatus {
        DRAFT,
        PUBLISHED,
        CLOSED,
        ARCHIVED
    }
}
