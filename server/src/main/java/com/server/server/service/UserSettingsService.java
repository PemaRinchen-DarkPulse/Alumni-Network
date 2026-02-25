package com.server.server.service;

import com.server.server.dto.UserSettingsDTO;
import com.server.server.model.User;
import com.server.server.model.UserSettings;
import com.server.server.repository.UserRepository;
import com.server.server.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserSettingsService {
    
    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public UserSettingsDTO getUserSettings() {
        User user = getCurrentUser();
        
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultSettings(user));
        
        return mapToDTO(settings, user);
    }
    
    @Transactional
    public UserSettingsDTO updateSettings(UserSettingsDTO settingsDTO) {
        User user = getCurrentUser();
        
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultSettings(user));
        
        updateSettingsFromDTO(settings, settingsDTO, user);
        
        settings = userSettingsRepository.save(settings);
        return mapToDTO(settings, user);
    }
    
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + username));
    }
    
    private UserSettings createDefaultSettings(User user) {
        UserSettings settings = new UserSettings();
        settings.setUser(user);
        
        // Set default values
        settings.setTimeZone("UTC");
        settings.setProfileVisibility("network");
        settings.setShowEmail(true);
        settings.setShowPhone(false);
        settings.setCanMessageMe("everyone");
        settings.setCanSendConnectionRequests("everyone");
        
        settings.setEmailNotificationsMessages(true);
        settings.setEmailNotificationsMentorship(true);
        settings.setEmailNotificationsEvents(true);
        settings.setInappNotificationsMentions(true);
        settings.setInappNotificationsAnnouncements(true);
        settings.setDigestFrequency("daily");
        
        settings.setLanguage("en");
        settings.setTheme("light");
        settings.setDateFormat("MM/DD/YYYY");
        
        return userSettingsRepository.save(settings);
    }
    
    private UserSettingsDTO mapToDTO(UserSettings settings, User user) {
        UserSettingsDTO dto = new UserSettingsDTO();
        
        // Account settings
        UserSettingsDTO.AccountSettingsDTO account = new UserSettingsDTO.AccountSettingsDTO();
        account.setFullName(user.getName());
        account.setEmail(user.getEmail());
        account.setTimeZone(settings.getTimeZone());
        account.setProfilePhoto(settings.getProfilePhoto());
        dto.setAccount(account);
        
        // Privacy settings
        UserSettingsDTO.PrivacySettingsDTO privacy = new UserSettingsDTO.PrivacySettingsDTO();
        privacy.setProfileVisibility(settings.getProfileVisibility());
        privacy.setShowEmail(settings.getShowEmail());
        privacy.setShowPhone(settings.getShowPhone());
        privacy.setCanMessageMe(settings.getCanMessageMe());
        privacy.setCanSendConnectionRequests(settings.getCanSendConnectionRequests());
        dto.setPrivacy(privacy);
        
        // Notification settings
        UserSettingsDTO.NotificationSettingsDTO notifications = new UserSettingsDTO.NotificationSettingsDTO();
        
        UserSettingsDTO.NotificationSettingsDTO.EmailNotificationsDTO emailNotif = 
                new UserSettingsDTO.NotificationSettingsDTO.EmailNotificationsDTO();
        emailNotif.setMessages(settings.getEmailNotificationsMessages());
        emailNotif.setMentorshipRequests(settings.getEmailNotificationsMentorship());
        emailNotif.setEventReminders(settings.getEmailNotificationsEvents());
        notifications.setEmailNotifications(emailNotif);
        
        UserSettingsDTO.NotificationSettingsDTO.InAppNotificationsDTO inAppNotif = 
                new UserSettingsDTO.NotificationSettingsDTO.InAppNotificationsDTO();
        inAppNotif.setMentions(settings.getInappNotificationsMentions());
        inAppNotif.setAnnouncements(settings.getInappNotificationsAnnouncements());
        notifications.setInAppNotifications(inAppNotif);
        
        notifications.setDigestFrequency(settings.getDigestFrequency());
        dto.setNotifications(notifications);
        
        // Appearance settings
        UserSettingsDTO.AppearanceSettingsDTO appearance = new UserSettingsDTO.AppearanceSettingsDTO();
        appearance.setLanguage(settings.getLanguage());
        appearance.setTheme(settings.getTheme());
        appearance.setDateFormat(settings.getDateFormat());
        dto.setAppearance(appearance);
        
        // Role-specific settings
        if (user.getRole() == User.Role.ALUMNI) {
            // Mentorship settings
            if (settings.getMentorshipStatus() != null) {
                UserSettingsDTO.MentorshipSettingsDTO mentorship = new UserSettingsDTO.MentorshipSettingsDTO();
                mentorship.setMentorshipStatus(settings.getMentorshipStatus());
                mentorship.setExpertiseAreas(stringToList(settings.getExpertiseAreas()));
                mentorship.setPreferredMenteeLevel(settings.getPreferredMenteeLevel());
                mentorship.setAvailability(settings.getAvailability());
                mentorship.setSessionFormat(stringToList(settings.getSessionFormat()));
                dto.setMentorship(mentorship);
            }
            
            // Professional profile
            if (settings.getCurrentRole() != null || settings.getOrganization() != null) {
                UserSettingsDTO.ProfessionalProfileDTO professional = new UserSettingsDTO.ProfessionalProfileDTO();
                professional.setCurrentRole(settings.getCurrentRole());
                professional.setOrganization(settings.getOrganization());
                professional.setIndustry(settings.getIndustry());
                professional.setSkills(stringToList(settings.getSkills()));
                professional.setWillingToHelp(stringToList(settings.getWillingToHelp()));
                dto.setProfessional(professional);
            }
        } else if (user.getRole() == User.Role.TEACHER) {
            // Teaching settings
            UserSettingsDTO.TeachingSettingsDTO teaching = new UserSettingsDTO.TeachingSettingsDTO();
            teaching.setAcademicExpertise(stringToList(settings.getAcademicExpertise()));
            teaching.setMentorshipAvailability(settings.getMentorshipAvailability());
            teaching.setStudentLevelPreference(settings.getStudentLevelPreference());
            dto.setTeaching(teaching);
            
            // Moderation settings
            UserSettingsDTO.ModerationSettingsDTO moderation = new UserSettingsDTO.ModerationSettingsDTO();
            moderation.setReceiveReportedContentAlerts(settings.getReceiveReportedContentAlerts());
            moderation.setApproveMentorshipRequests(settings.getApproveMentorshipRequests());
            moderation.setCanPinPosts(settings.getCanPinPosts());
            dto.setModeration(moderation);
        } else if (user.getRole() == User.Role.STUDENT) {
            // Learning settings
            UserSettingsDTO.LearningSettingsDTO learning = new UserSettingsDTO.LearningSettingsDTO();
            learning.setLookingFor(stringToList(settings.getLookingFor()));
            learning.setPreferredMentors(stringToList(settings.getPreferredMentors()));
            learning.setTopicsOfInterest(stringToList(settings.getTopicsOfInterest()));
            dto.setLearning(learning);
            
            // Career settings
            UserSettingsDTO.CareerSettingsDTO career = new UserSettingsDTO.CareerSettingsDTO();
            career.setIndustriesOfInterest(stringToList(settings.getIndustriesOfInterest()));
            career.setLocationPreference(settings.getLocationPreference());
            career.setOpenToOpportunities(settings.getOpenToOpportunities());
            dto.setCareer(career);
        }
        
        return dto;
    }
    
    private void updateSettingsFromDTO(UserSettings settings, UserSettingsDTO dto, User user) {
        // Update account settings
        if (dto.getAccount() != null) {
            settings.setTimeZone(dto.getAccount().getTimeZone());
            settings.setProfilePhoto(dto.getAccount().getProfilePhoto());
            
            // Update user name if changed
            if (dto.getAccount().getFullName() != null && 
                !dto.getAccount().getFullName().equals(user.getName())) {
                user.setName(dto.getAccount().getFullName());
                userRepository.save(user);
            }
        }
        
        // Update privacy settings
        if (dto.getPrivacy() != null) {
            settings.setProfileVisibility(dto.getPrivacy().getProfileVisibility());
            settings.setShowEmail(dto.getPrivacy().getShowEmail());
            settings.setShowPhone(dto.getPrivacy().getShowPhone());
            settings.setCanMessageMe(dto.getPrivacy().getCanMessageMe());
            settings.setCanSendConnectionRequests(dto.getPrivacy().getCanSendConnectionRequests());
        }
        
        // Update notification settings
        if (dto.getNotifications() != null) {
            if (dto.getNotifications().getEmailNotifications() != null) {
                settings.setEmailNotificationsMessages(dto.getNotifications().getEmailNotifications().getMessages());
                settings.setEmailNotificationsMentorship(dto.getNotifications().getEmailNotifications().getMentorshipRequests());
                settings.setEmailNotificationsEvents(dto.getNotifications().getEmailNotifications().getEventReminders());
            }
            if (dto.getNotifications().getInAppNotifications() != null) {
                settings.setInappNotificationsMentions(dto.getNotifications().getInAppNotifications().getMentions());
                settings.setInappNotificationsAnnouncements(dto.getNotifications().getInAppNotifications().getAnnouncements());
            }
            settings.setDigestFrequency(dto.getNotifications().getDigestFrequency());
        }
        
        // Update appearance settings
        if (dto.getAppearance() != null) {
            settings.setLanguage(dto.getAppearance().getLanguage());
            settings.setTheme(dto.getAppearance().getTheme());
            settings.setDateFormat(dto.getAppearance().getDateFormat());
        }
        
        // Update role-specific settings
        if (user.getRole() == User.Role.ALUMNI) {
            if (dto.getMentorship() != null) {
                settings.setMentorshipStatus(dto.getMentorship().getMentorshipStatus());
                settings.setExpertiseAreas(listToString(dto.getMentorship().getExpertiseAreas()));
                settings.setPreferredMenteeLevel(dto.getMentorship().getPreferredMenteeLevel());
                settings.setAvailability(dto.getMentorship().getAvailability());
                settings.setSessionFormat(listToString(dto.getMentorship().getSessionFormat()));
            }
            if (dto.getProfessional() != null) {
                settings.setCurrentRole(dto.getProfessional().getCurrentRole());
                settings.setOrganization(dto.getProfessional().getOrganization());
                settings.setIndustry(dto.getProfessional().getIndustry());
                settings.setSkills(listToString(dto.getProfessional().getSkills()));
                settings.setWillingToHelp(listToString(dto.getProfessional().getWillingToHelp()));
            }
        } else if (user.getRole() == User.Role.TEACHER) {
            if (dto.getTeaching() != null) {
                settings.setAcademicExpertise(listToString(dto.getTeaching().getAcademicExpertise()));
                settings.setMentorshipAvailability(dto.getTeaching().getMentorshipAvailability());
                settings.setStudentLevelPreference(dto.getTeaching().getStudentLevelPreference());
            }
            if (dto.getModeration() != null) {
                settings.setReceiveReportedContentAlerts(dto.getModeration().getReceiveReportedContentAlerts());
                settings.setApproveMentorshipRequests(dto.getModeration().getApproveMentorshipRequests());
                settings.setCanPinPosts(dto.getModeration().getCanPinPosts());
            }
        } else if (user.getRole() == User.Role.STUDENT) {
            if (dto.getLearning() != null) {
                settings.setLookingFor(listToString(dto.getLearning().getLookingFor()));
                settings.setPreferredMentors(listToString(dto.getLearning().getPreferredMentors()));
                settings.setTopicsOfInterest(listToString(dto.getLearning().getTopicsOfInterest()));
            }
            if (dto.getCareer() != null) {
                settings.setIndustriesOfInterest(listToString(dto.getCareer().getIndustriesOfInterest()));
                settings.setLocationPreference(dto.getCareer().getLocationPreference());
                settings.setOpenToOpportunities(dto.getCareer().getOpenToOpportunities());
            }
        }
    }
    
    private List<String> stringToList(String str) {
        if (str == null || str.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
    
    private String listToString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        return String.join(",", list);
    }
}
