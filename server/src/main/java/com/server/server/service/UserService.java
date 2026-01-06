package com.server.server.service;

import com.server.server.dto.UserDTO;
import com.server.server.model.User;
import com.server.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public List<UserDTO> getAllUsers(String role, String batch, String search, String currentUserEmail) {
        List<User> users = userRepository.findAll();
        
        // Filter only verified users
        users = users.stream()
                .filter(User::isEmailVerified)
                .collect(Collectors.toList());
        
        // Exclude current user if email is provided
        if (currentUserEmail != null && !currentUserEmail.isEmpty()) {
            users = users.stream()
                    .filter(user -> !user.getEmail().equals(currentUserEmail))
                    .collect(Collectors.toList());
        }
        
        // Filter by role if provided
        if (role != null && !role.isEmpty()) {
            User.Role roleEnum = User.Role.fromString(role);
            users = users.stream()
                    .filter(user -> user.getRole() == roleEnum)
                    .collect(Collectors.toList());
        }
        
        // Filter by batch if provided
        if (batch != null && !batch.isEmpty()) {
            users = users.stream()
                    .filter(user -> batch.equals(user.getBatch()))
                    .collect(Collectors.toList());
        }
        
        // Filter by search query if provided (search in name and email)
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            users = users.stream()
                    .filter(user -> 
                        user.getName().toLowerCase().contains(searchLower) ||
                        user.getEmail().toLowerCase().contains(searchLower)
                    )
                    .collect(Collectors.toList());
        }
        
        return users.stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());
    }
    
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .filter(User::isEmailVerified)
                .map(UserDTO::fromUser)
                .orElse(null);
    }
}
