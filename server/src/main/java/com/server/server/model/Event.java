package com.server.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"attendees"})
@ToString(exclude = {"attendees"})
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime startDateTime;
    
    @Column(nullable = false)
    private LocalDateTime endDateTime;
    
    @Column
    private String location;
    
    @Column
    private String meetingLink;
    
    @Column
    private Integer capacity;

    @Column(nullable = false)
    private int attendeeCount = 0;

    @ManyToMany
    @JoinTable(
            name = "event_attendees",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> attendees = new HashSet<>();
    
    @Column(nullable = false)
    private Boolean isVirtual = false;
    
    @Column(nullable = false)
    private Boolean isFeatured = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility = Visibility.PUBLIC;
    
    @Column
    private Integer maxAttendees;
    
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] bannerImage;
    
    @Column(nullable = false)
    private Long createdBy;
    
    @Column
    private String createdByName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.DRAFT;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum Visibility {
        PUBLIC,
        PRIVATE,
        ALUMNI
    }
    
    public enum EventStatus {
        DRAFT,
        PUBLISHED,
        CANCELLED
    }
}
