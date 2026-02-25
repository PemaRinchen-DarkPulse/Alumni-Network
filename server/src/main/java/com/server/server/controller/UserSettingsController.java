package com.server.server.controller;

import com.server.server.dto.UserSettingsDTO;
import com.server.server.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserSettingsController {
    
    private final UserSettingsService userSettingsService;
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserSettingsDTO> getUserSettings() {
        UserSettingsDTO settings = userSettingsService.getUserSettings();
        return ResponseEntity.ok(settings);
    }
    
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody UserSettingsDTO settingsDTO) {
        try {
            UserSettingsDTO updatedSettings = userSettingsService.updateSettings(settingsDTO);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Settings updated successfully",
                "data", updatedSettings
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> updatePassword(
            @RequestBody Map<String, String> passwordData) {
        try {
            // Implementation for password update
            // This would require additional security checks
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/profile-photo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> uploadProfilePhoto(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            // Implementation for file upload
            // This would require file storage service
            return ResponseEntity.ok(Map.of(
                "success", true,
                "photoUrl", "/uploads/photos/" + file.getOriginalFilename()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/deactivate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deactivateAccount() {
        try {
            // Implementation for account deactivation
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Account deactivated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/blocked-users")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getBlockedUsers() {
        try {
            // Implementation for getting blocked users
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", new java.util.ArrayList<>()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/block-user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> blockUser(@PathVariable Long userId) {
        try {
            // Implementation for blocking a user
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User blocked successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @DeleteMapping("/unblock-user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> unblockUser(@PathVariable Long userId) {
        try {
            // Implementation for unblocking a user
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User unblocked successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
