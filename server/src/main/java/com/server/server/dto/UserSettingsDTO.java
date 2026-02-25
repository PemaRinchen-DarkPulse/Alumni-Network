package com.server.server.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserSettingsDTO {
    private AccountSettingsDTO account;
    private PrivacySettingsDTO privacy;
    private NotificationSettingsDTO notifications;
    private AppearanceSettingsDTO appearance;
    private MentorshipSettingsDTO mentorship;
    private ProfessionalProfileDTO professional;
    private TeachingSettingsDTO teaching;
    private ModerationSettingsDTO moderation;
    private LearningSettingsDTO learning;
    private CareerSettingsDTO career;
    
    @Data
    public static class AccountSettingsDTO {
        private String fullName;
        private String email;
        private String timeZone;
        private String profilePhoto;
    }
    
    @Data
    public static class PrivacySettingsDTO {
        private String profileVisibility;
        private Boolean showEmail;
        private Boolean showPhone;
        private String canMessageMe;
        private String canSendConnectionRequests;
    }
    
    @Data
    public static class NotificationSettingsDTO {
        private EmailNotificationsDTO emailNotifications;
        private InAppNotificationsDTO inAppNotifications;
        private String digestFrequency;
        
        @Data
        public static class EmailNotificationsDTO {
            private Boolean messages;
            private Boolean mentorshipRequests;
            private Boolean eventReminders;
        }
        
        @Data
        public static class InAppNotificationsDTO {
            private Boolean mentions;
            private Boolean announcements;
        }
    }
    
    @Data
    public static class AppearanceSettingsDTO {
        private String language;
        private String theme;
        private String dateFormat;
    }
    
    @Data
    public static class MentorshipSettingsDTO {
        private String mentorshipStatus;
        private List<String> expertiseAreas;
        private String preferredMenteeLevel;
        private String availability;
        private List<String> sessionFormat;
    }
    
    @Data
    public static class ProfessionalProfileDTO {
        private String currentRole;
        private String organization;
        private String industry;
        private List<String> skills;
        private List<String> willingToHelp;
    }
    
    @Data
    public static class TeachingSettingsDTO {
        private List<String> academicExpertise;
        private Boolean mentorshipAvailability;
        private String studentLevelPreference;
    }
    
    @Data
    public static class ModerationSettingsDTO {
        private Boolean receiveReportedContentAlerts;
        private Boolean approveMentorshipRequests;
        private Boolean canPinPosts;
    }
    
    @Data
    public static class LearningSettingsDTO {
        private List<String> lookingFor;
        private List<String> preferredMentors;
        private List<String> topicsOfInterest;
    }
    
    @Data
    public static class CareerSettingsDTO {
        private List<String> industriesOfInterest;
        private String locationPreference;
        private Boolean openToOpportunities;
    }
}
