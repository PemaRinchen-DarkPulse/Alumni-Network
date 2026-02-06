package com.server.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tributes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tribute {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String teacherName;
    
    @Column
    private String department;
    
    @Column
    private String subject;
    
    @Column
    private String yearsFrom;
    
    @Column
    private String yearsTo;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(nullable = false)
    private Long authorId;
    
    @Column
    private String authorName;
    
    @Column(nullable = false)
    private int likeCount = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TributeStatus status = TributeStatus.PENDING;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime publishedAt;
    
    public enum TributeStatus {
        PENDING,
        PUBLISHED,
        ARCHIVED
    }
}
