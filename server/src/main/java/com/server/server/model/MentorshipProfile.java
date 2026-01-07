package com.server.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "mentorship_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long userId;
    
    @Column(nullable = false)
    private String professionalHeadline;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @ElementCollection
    @CollectionTable(name = "mentorship_expertise", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "expertise")
    private List<String> expertise;
    
    @ElementCollection
    @CollectionTable(name = "mentorship_topics", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "topic")
    private List<String> selectedTopics;
    
    @ElementCollection
    @CollectionTable(name = "mentorship_other_topics", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "topic")
    private List<String> otherTopics;
    
    @Column(nullable = false)
    private Boolean openForBookings = true;
    
    @Column
    private String maxHoursPerMonth;
    
    @Column
    private String timezone;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProfileStatus status = ProfileStatus.DRAFT;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum ProfileStatus {
        DRAFT,
        PUBLISHED
    }
}
