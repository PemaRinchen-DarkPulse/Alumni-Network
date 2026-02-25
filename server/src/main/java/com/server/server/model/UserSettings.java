package com.server.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    // Account Settings
    @Column(name = "time_zone")
    private String timeZone = "UTC";
    
    @Column(name = "profile_photo")
    private String profilePhoto;
    
    // Privacy Settings
    @Column(name = "profile_visibility")
    private String profileVisibility = "network";
    
    @Column(name = "show_email")
    private Boolean showEmail = true;
    
    @Column(name = "show_phone")
    private Boolean showPhone = false;
    
    @Column(name = "can_message_me")
    private String canMessageMe = "everyone";
    
    @Column(name = "can_send_connection_requests")
    private String canSendConnectionRequests = "everyone";
    
    // Notification Settings
    @Column(name = "email_notifications_messages")
    private Boolean emailNotificationsMessages = true;
    
    @Column(name = "email_notifications_mentorship")
    private Boolean emailNotificationsMentorship = true;
    
    @Column(name = "email_notifications_events")
    private Boolean emailNotificationsEvents = true;
    
    @Column(name = "inapp_notifications_mentions")
    private Boolean inappNotificationsMentions = true;
    
    @Column(name = "inapp_notifications_announcements")
    private Boolean inappNotificationsAnnouncements = true;
    
    @Column(name = "digest_frequency")
    private String digestFrequency = "daily";
    
    // Appearance Settings
    @Column(name = "language")
    private String language = "en";
    
    @Column(name = "theme")
    private String theme = "light";
    
    @Column(name = "date_format")
    private String dateFormat = "MM/DD/YYYY";
    
    // Alumni-Specific Settings
    @Column(name = "mentorship_status")
    private String mentorshipStatus;
    
    @Column(name = "expertise_areas", columnDefinition = "TEXT")
    private String expertiseAreas;
    
    @Column(name = "preferred_mentee_level")
    private String preferredMenteeLevel;
    
    @Column(name = "availability")
    private String availability;
    
    @Column(name = "session_format", columnDefinition = "TEXT")
    private String sessionFormat;
    
    // Professional Profile
    @Column(name = "current_role")
    private String currentRole;
    
    @Column(name = "organization")
    private String organization;
    
    @Column(name = "industry")
    private String industry;
    
    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;
    
    @Column(name = "willing_to_help", columnDefinition = "TEXT")
    private String willingToHelp;
    
    // Teacher-Specific Settings
    @Column(name = "academic_expertise", columnDefinition = "TEXT")
    private String academicExpertise;
    
    @Column(name = "mentorship_availability")
    private Boolean mentorshipAvailability;
    
    @Column(name = "student_level_preference")
    private String studentLevelPreference;
    
    @Column(name = "receive_reported_content_alerts")
    private Boolean receiveReportedContentAlerts;
    
    @Column(name = "approve_mentorship_requests")
    private Boolean approveMentorshipRequests;
    
    @Column(name = "can_pin_posts")
    private Boolean canPinPosts;
    
    // Student-Specific Settings
    @Column(name = "looking_for", columnDefinition = "TEXT")
    private String lookingFor;
    
    @Column(name = "preferred_mentors", columnDefinition = "TEXT")
    private String preferredMentors;
    
    @Column(name = "topics_of_interest", columnDefinition = "TEXT")
    private String topicsOfInterest;
    
    @Column(name = "industries_of_interest", columnDefinition = "TEXT")
    private String industriesOfInterest;
    
    @Column(name = "location_preference")
    private String locationPreference;
    
    @Column(name = "open_to_opportunities")
    private Boolean openToOpportunities;
}
