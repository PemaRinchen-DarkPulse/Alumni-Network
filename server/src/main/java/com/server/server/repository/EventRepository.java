package com.server.server.repository;

import com.server.server.model.Event;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @EntityGraph(attributePaths = "attendees")
    List<Event> findAllWithAttendeesByStatus(Event.EventStatus status);
    
    // Find all published events
    List<Event> findByStatus(Event.EventStatus status);
    
    // Find events created by a specific user
    List<Event> findByCreatedBy(Long userId);
    
    // Find events by creator and status
    List<Event> findByCreatedByAndStatus(Long userId, Event.EventStatus status);
    
    // Find upcoming published events
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND e.startDateTime >= :currentTime ORDER BY e.startDateTime ASC")
    List<Event> findUpcomingPublishedEvents(@Param("currentTime") LocalDateTime currentTime);
    
    // Find events by visibility
    List<Event> findByStatusAndVisibility(Event.EventStatus status, Event.Visibility visibility);
}
