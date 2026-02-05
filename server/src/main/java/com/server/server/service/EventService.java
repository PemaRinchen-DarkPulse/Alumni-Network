package com.server.server.service;

import com.server.server.dto.EventDTO;
import com.server.server.dto.EventRequest;
import com.server.server.model.Event;
import com.server.server.model.User;
import com.server.server.repository.EventRepository;
import com.server.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public EventDTO saveDraft(EventRequest request) {
        log.info("Saving event draft: {}", request.getTitle());
        
        Event event = new Event();
        updateEventFromRequest(event, request);
        event.setStatus(Event.EventStatus.DRAFT);
        
        Event savedEvent = eventRepository.save(event);
        log.info("Draft saved successfully with ID: {}", savedEvent.getId());
        
        return EventDTO.fromEntity(savedEvent);
    }

    @Transactional
    public void rsvpToEvent(Long eventId) {
        // Get the username from the authentication principal
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + username));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        if (event.getAttendees().contains(user)) {
            throw new RuntimeException("User has already RSVP'd to this event.");
        }

        if (event.getCapacity() != null && event.getAttendeeCount() >= event.getCapacity()) {
            throw new RuntimeException("Event is full.");
        }

        event.getAttendees().add(user);
        event.setAttendeeCount(event.getAttendeeCount() + 1);
        user.getRsvpedEvents().add(event);

        eventRepository.save(event);
        userRepository.save(user);
    }

    @Transactional
    public void cancelRsvp(Long eventId) {
        // Get the username from the authentication principal
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + username));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        if (!event.getAttendees().contains(user)) {
            throw new RuntimeException("User has not RSVP'd to this event.");
        }

        event.getAttendees().remove(user);
        event.setAttendeeCount(event.getAttendeeCount() - 1);
        user.getRsvpedEvents().remove(event);

        eventRepository.save(event);
        userRepository.save(user);
    }
    
    @Transactional
    public EventDTO publishEvent(EventRequest request) {
        log.info("Publishing event: {}", request.getTitle());
        
        Event event = new Event();
        updateEventFromRequest(event, request);
        event.setStatus(Event.EventStatus.PUBLISHED);
        
        Event savedEvent = eventRepository.save(event);
        log.info("Event published successfully with ID: {}", savedEvent.getId());
        
        return EventDTO.fromEntity(savedEvent);
    }
    
    public EventDTO getEventById(Long id) {
        log.info("Fetching event with ID: {}", id);
        
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
        
        return EventDTO.fromEntity(event);
    }
    
    public List<EventDTO> getAllPublishedEvents() {
        log.info("Fetching all published events");
        
        List<Event> events = eventRepository.findAllWithAttendeesByStatus(Event.EventStatus.PUBLISHED);
        
        return events.stream()
                .map(EventDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<EventDTO> getUpcomingEvents() {
        log.info("Fetching upcoming published events");
        
        List<Event> events = eventRepository.findUpcomingPublishedEvents(LocalDateTime.now());
        
        return events.stream()
                .map(EventDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<EventDTO> getEventsByCreator(Long userId) {
        log.info("Fetching events created by user: {}", userId);
        
        List<Event> events = eventRepository.findByCreatedBy(userId);
        
        return events.stream()
                .map(EventDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public EventDTO getLatestDraft(Long userId) {
        log.info("Fetching latest draft for user: {}", userId);
        
        List<Event> drafts = eventRepository.findByCreatedByAndStatus(userId, Event.EventStatus.DRAFT);
        
        if (drafts.isEmpty()) {
            return null;
        }
        
        // Get the most recent draft
        Event latestDraft = drafts.stream()
                .max((e1, e2) -> e1.getUpdatedAt().compareTo(e2.getUpdatedAt()))
                .orElse(null);
        
        return latestDraft != null ? EventDTO.fromEntity(latestDraft) : null;
    }
    
    @Transactional
    public EventDTO updateEvent(Long id, EventRequest request) {
        log.info("Updating event with ID: {}", id);
        
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
        
        updateEventFromRequest(event, request);
        
        if (request.getStatus() != null) {
            try {
                event.setStatus(Event.EventStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status provided: {}, keeping current status", request.getStatus());
            }
        }
        
        Event savedEvent = eventRepository.save(event);
        log.info("Event updated successfully with ID: {}", savedEvent.getId());
        
        return EventDTO.fromEntity(savedEvent);
    }
    
    @Transactional
    public void deleteEvent(Long id) {
        log.info("Deleting event with ID: {}", id);
        
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
        
        eventRepository.delete(event);
        log.info("Event deleted successfully with ID: {}", id);
    }
    
    private void updateEventFromRequest(Event event, EventRequest request) {
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDateTime(request.getStartDateTime());
        event.setEndDateTime(request.getEndDateTime());
        event.setLocation(request.getLocation());
        event.setMeetingLink(request.getMeetingLink());
        event.setIsVirtual(request.getIsVirtual() != null ? request.getIsVirtual() : false);
        event.setMaxAttendees(request.getMaxAttendees());
        
        // Handle base64 encoded image
        if (request.getBannerImageUrl() != null && !request.getBannerImageUrl().isEmpty()) {
            try {
                // Remove data:image prefix if present
                String base64Image = request.getBannerImageUrl();
                if (base64Image.contains(",")) {
                    base64Image = base64Image.split(",")[1];
                }
                byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                event.setBannerImage(imageBytes);
                log.info("Successfully converted base64 image to byte array, size: {} bytes", imageBytes.length);
            } catch (IllegalArgumentException e) {
                log.error("Failed to decode base64 image: {}", e.getMessage());
                event.setBannerImage(null);
            }
        } else {
            event.setBannerImage(null);
        }
        
        event.setCreatedBy(request.getCreatedBy());
        
        if (request.getVisibility() != null) {
            try {
                event.setVisibility(Event.Visibility.valueOf(request.getVisibility().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid visibility provided: {}, setting to PUBLIC", request.getVisibility());
                event.setVisibility(Event.Visibility.PUBLIC);
            }
        } else {
            event.setVisibility(Event.Visibility.PUBLIC);
        }
    }
}
