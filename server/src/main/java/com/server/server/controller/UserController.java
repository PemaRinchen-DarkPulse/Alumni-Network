package com.server.server.controller;

import com.server.server.dto.UserDTO;
import com.server.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String currentUserEmail
    ) {
        List<UserDTO> users = userService.getAllUsers(role, batch, search, currentUserEmail);
        
        Map<String, Object> response = Map.of(
            "success", true,
            "data", users,
            "count", users.size()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        
        if (user != null) {
            Map<String, Object> response = Map.of(
                "success", true,
                "data", user
            );
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "User not found"
            );
            return ResponseEntity.notFound().build();
        }
    }
}
