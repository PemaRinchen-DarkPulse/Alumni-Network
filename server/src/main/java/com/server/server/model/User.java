package com.server.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column
    private String batch;
    
    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;
    
    @Column
    private String verificationToken;
    
    @Column
    private LocalDateTime tokenExpiry;
    
    @Column
    private String resetToken;
    
    @Column
    private LocalDateTime resetTokenExpiry;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;
    
    public enum Role {
        STUDENT,
        ALUMNI,
        TEACHER;
        
        @com.fasterxml.jackson.annotation.JsonCreator
        public static Role fromString(String value) {
            if (value == null) {
                return null;
            }
            return Role.valueOf(value.toUpperCase());
        }
    }
}
