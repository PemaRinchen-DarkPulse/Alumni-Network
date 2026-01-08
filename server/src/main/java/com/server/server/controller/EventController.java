package com.server.server.controller;

import com.server.server.dto.EventDTO;
import com.server.server.dto.EventRequest;
import com.server.server.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class EventController {
    
    private final EventService eventService;
    
    @PostMapping("/draft")
    public ResponseEntity<Map<String, Object>> saveDraft(@RequestBody EventRequest request) {
        log.info("Received request to save event draft: {}", request.getTitle());
        log.info("Request details - StartDateTime: {}, EndDateTime: {}, CreatedBy: {}, IsVirtual: {}", 
                 request.getStartDateTime(), request.getEndDateTime(), request.getCreatedBy(), request.getIsVirtual());
        
        try {
            EventDTO event = eventService.saveDraft(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", event,
                "message", "Event draft saved successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving event draft: ", e);
            log.error("Error type: {}", e.getClass().getName());
            log.error("Error message: {}", e.getMessage());
            if (e.getCause() != null) {
                log.error("Cause: {}", e.getCause().getMessage());
            }
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to save event draft: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/publish")
    public ResponseEntity<Map<String, Object>> publishEvent(@RequestBody EventRequest request) {
        log.info("Received request to publish event: {}", request.getTitle());
        log.info("Request details - StartDateTime: {}, EndDateTime: {}, CreatedBy: {}, IsVirtual: {}", 
                 request.getStartDateTime(), request.getEndDateTime(), request.getCreatedBy(), request.getIsVirtual());
        
        try {
            EventDTO event = eventService.publishEvent(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", event,
                "message", "Event published successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing event: ", e);
            log.error("Error type: {}", e.getClass().getName());
            log.error("Error message: {}", e.getMessage());
            if (e.getCause() != null) {
                log.error("Cause: {}", e.getCause().getMessage());
            }
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish event: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEventById(@PathVariable Long id) {
        log.info("Received request to get event with ID: {}", id);
        
        try {
            EventDTO event = eventService.getEventById(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", event
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching event: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch event: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPublishedEvents() {
        log.info("Received request to get all published events");
        
        try {
            List<EventDTO> events = eventService.getAllPublishedEvents();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", events,
                "count", events.size()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching events: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch events: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<Map<String, Object>> getUpcomingEvents() {
        log.info("Received request to get upcoming events");
        
        try {
            List<EventDTO> events = eventService.getUpcomingEvents();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", events,
                "count", events.size()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching upcoming events: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch upcoming events: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/creator/{userId}")
    public ResponseEntity<Map<String, Object>> getEventsByCreator(@PathVariable Long userId) {
        log.info("Received request to get events by creator: {}", userId);
        
        try {
            List<EventDTO> events = eventService.getEventsByCreator(userId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", events,
                "count", events.size()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching events by creator: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch events: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/draft/latest/{userId}")
    public ResponseEntity<Map<String, Object>> getLatestDraft(@PathVariable Long userId) {
        log.info("Received request to get latest draft for user: {}", userId);
        
        try {
            EventDTO draft = eventService.getLatestDraft(userId);
            
            if (draft != null) {
                Map<String, Object> response = Map.of(
                    "success", true,
                    "data", draft
                );
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = Map.of(
                    "success", true,
                    "data", (Object) null
                );
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            log.error("Error fetching latest draft: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch draft: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEvent(
            @PathVariable Long id,
            @RequestBody EventRequest request) {
        log.info("Received request to update event: {}", id);
        
        try {
            EventDTO event = eventService.updateEvent(id, request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", event,
                "message", "Event updated successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating event: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to update event: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEvent(@PathVariable Long id) {
        log.info("Received request to delete event: {}", id);
        
        try {
            eventService.deleteEvent(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Event deleted successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting event: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to delete event: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
