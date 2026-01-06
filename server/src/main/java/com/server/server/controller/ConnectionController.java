package com.server.server.controller;

import com.server.server.dto.ConnectionDTO;
import com.server.server.dto.ConnectionRequestDTO;
import com.server.server.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ConnectionController {
    
    private final ConnectionService connectionService;
    
    /**
     * Send a connection request
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendConnectionRequest(
            @RequestParam Long senderId,
            @RequestBody ConnectionRequestDTO request
    ) {
        try {
            ConnectionDTO connection = connectionService.sendConnectionRequest(
                senderId, 
                request.getReceiverId()
            );
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Connection request sent successfully",
                "data", connection
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Accept a connection request
     */
    @PostMapping("/{connectionId}/accept")
    public ResponseEntity<Map<String, Object>> acceptConnectionRequest(
            @PathVariable Long connectionId,
            @RequestParam Long userId
    ) {
        try {
            ConnectionDTO connection = connectionService.acceptConnectionRequest(connectionId, userId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Connection request accepted",
                "data", connection
            );
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Reject a connection request
     */
    @PostMapping("/{connectionId}/reject")
    public ResponseEntity<Map<String, Object>> rejectConnectionRequest(
            @PathVariable Long connectionId,
            @RequestParam Long userId
    ) {
        try {
            ConnectionDTO connection = connectionService.rejectConnectionRequest(connectionId, userId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Connection request rejected",
                "data", connection
            );
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Withdraw a sent connection request
     */
    @PostMapping("/{connectionId}/withdraw")
    public ResponseEntity<Map<String, Object>> withdrawConnectionRequest(
            @PathVariable Long connectionId,
            @RequestParam Long userId
    ) {
        try {
            connectionService.withdrawConnectionRequest(connectionId, userId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Connection request withdrawn and deleted"
            );
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get pending connection requests received by a user
     */
    @GetMapping("/pending/received")
    public ResponseEntity<Map<String, Object>> getPendingRequestsReceived(
            @RequestParam Long userId
    ) {
        List<ConnectionDTO> connections = connectionService.getPendingRequestsReceived(userId);
        
        Map<String, Object> response = Map.of(
            "success", true,
            "data", connections,
            "count", connections.size()
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get pending connection requests sent by a user
     */
    @GetMapping("/pending/sent")
    public ResponseEntity<Map<String, Object>> getPendingRequestsSent(
            @RequestParam Long userId
    ) {
        List<ConnectionDTO> connections = connectionService.getPendingRequestsSent(userId);
        
        Map<String, Object> response = Map.of(
            "success", true,
            "data", connections,
            "count", connections.size()
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all accepted connections for a user
     */
    @GetMapping("/accepted")
    public ResponseEntity<Map<String, Object>> getAcceptedConnections(
            @RequestParam Long userId
    ) {
        List<ConnectionDTO> connections = connectionService.getAcceptedConnections(userId);
        
        Map<String, Object> response = Map.of(
            "success", true,
            "data", connections,
            "count", connections.size()
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Check connection status between two users
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getConnectionStatus(
            @RequestParam Long userId1,
            @RequestParam Long userId2
    ) {
        String status = connectionService.getConnectionStatus(userId1, userId2);
        
        Map<String, Object> response = Map.of(
            "success", true,
            "status", status
        );
        
        return ResponseEntity.ok(response);
    }
}
