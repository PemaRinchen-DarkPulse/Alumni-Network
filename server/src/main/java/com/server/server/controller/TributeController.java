package com.server.server.controller;

import com.server.server.dto.TributeDTO;
import com.server.server.dto.TributeRequest;
import com.server.server.service.TributeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tributes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class TributeController {
    
    private final TributeService tributeService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTribute(@RequestBody TributeRequest request) {
        log.info("Received request to create tribute for teacher: {}", request.getTeacherName());
        
        try {
            TributeDTO tribute = tributeService.createTribute(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tribute,
                "message", "Tribute submitted successfully and is pending review"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating tribute: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to create tribute: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/published")
    public ResponseEntity<Map<String, Object>> getAllPublishedTributes() {
        log.info("Received request to fetch all published tributes");
        
        try {
            List<TributeDTO> tributes = tributeService.getAllPublishedTributes();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tributes,
                "message", "Published tributes fetched successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching published tributes: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch tributes: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Map<String, Object>> getAllPendingTributes() {
        log.info("Received request to fetch all pending tributes");
        
        try {
            List<TributeDTO> tributes = tributeService.getAllPendingTributes();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tributes,
                "message", "Pending tributes fetched successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching pending tributes: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch pending tributes: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTributeById(@PathVariable Long id) {
        log.info("Received request to fetch tribute with ID: {}", id);
        
        try {
            TributeDTO tribute = tributeService.getTributeById(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tribute,
                "message", "Tribute fetched successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching tribute: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch tribute: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/author/{authorId}")
    public ResponseEntity<Map<String, Object>> getTributesByAuthor(@PathVariable Long authorId) {
        log.info("Received request to fetch tributes by author ID: {}", authorId);
        
        try {
            List<TributeDTO> tributes = tributeService.getTributesByAuthor(authorId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tributes,
                "message", "Author tributes fetched successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching author tributes: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch author tributes: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchTributesByTeacherName(
            @RequestParam String teacherName) {
        log.info("Received request to search tributes by teacher name: {}", teacherName);
        
        try {
            List<TributeDTO> tributes = tributeService.searchTributesByTeacherName(teacherName);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tributes,
                "message", "Tributes found successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error searching tributes: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to search tributes: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<Map<String, Object>> getTributesByDepartment(
            @PathVariable String department) {
        log.info("Received request to fetch tributes by department: {}", department);
        
        try {
            List<TributeDTO> tributes = tributeService.getTributesByDepartment(department);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tributes,
                "message", "Department tributes fetched successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching department tributes: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch department tributes: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTribute(
            @PathVariable Long id,
            @RequestBody TributeRequest request) {
        log.info("Received request to update tribute with ID: {}", id);
        
        try {
            TributeDTO tribute = tributeService.updateTribute(id, request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tribute,
                "message", "Tribute updated successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating tribute: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to update tribute: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Map<String, Object>> publishTribute(@PathVariable Long id) {
        log.info("Received request to publish tribute with ID: {}", id);
        
        try {
            TributeDTO tribute = tributeService.publishTribute(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tribute,
                "message", "Tribute published successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing tribute: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish tribute: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> likeTribute(@PathVariable Long id) {
        log.info("Received request to like tribute with ID: {}", id);
        
        try {
            TributeDTO tribute = tributeService.likeTribute(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tribute,
                "message", "Tribute liked successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error liking tribute: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to like tribute: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> unlikeTribute(@PathVariable Long id) {
        log.info("Received request to unlike tribute with ID: {}", id);
        
        try {
            TributeDTO tribute = tributeService.unlikeTribute(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", tribute,
                "message", "Tribute unliked successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error unliking tribute: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to unlike tribute: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Map<String, Object>> deleteTribute(@PathVariable Long id) {
        log.info("Received request to delete tribute with ID: {}", id);
        
        try {
            tributeService.deleteTribute(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Tribute deleted successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting tribute: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to delete tribute: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PatchMapping("/publish-all-pending")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Map<String, Object>> publishAllPendingTributes() {
        log.info("Received request to publish all pending tributes");
        
        try {
            List<TributeDTO> pendingTributes = tributeService.getAllPendingTributes();
            int count = 0;
            
            for (TributeDTO tribute : pendingTributes) {
                tributeService.publishTribute(tribute.getId());
                count++;
            }
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", count + " tribute(s) published successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing all pending tributes: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish tributes: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
