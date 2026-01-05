package com.server.server.service;

import com.server.server.dto.LoginRequest;
import com.server.server.dto.LoginResponse;
import com.server.server.dto.RegistrationRequest;
import com.server.server.dto.RegistrationResponse;
import com.server.server.model.User;
import com.server.server.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    // JWT Secret Key - In production, move to application.properties
    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long JWT_EXPIRATION = 86400000; // 24 hours in milliseconds
    
    @Transactional
    public RegistrationResponse registerUser(RegistrationRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new RegistrationResponse(
                false,
                "Email already registered",
                null
            );
        }
        
        // Validate batch requirement for students and alumni
        if ((request.getRole() == User.Role.STUDENT || request.getRole() == User.Role.ALUMNI) 
            && (request.getBatch() == null || request.getBatch().trim().isEmpty())) {
            return new RegistrationResponse(
                false,
                "Batch is required for students and alumni",
                null
            );
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setBatch(request.getBatch());
        user.setEmailVerified(false);
        
        // Generate verification token
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(5));
        
        System.out.println("🔑 Generated token: " + token);
        System.out.println("⏰ Token expiry set to: " + user.getTokenExpiry());
        
        // Save user
        User savedUser = userRepository.save(user);
        
        System.out.println("💾 User saved with ID: " + savedUser.getId());
        System.out.println("📧 Email: " + savedUser.getEmail());
        System.out.println("🔑 Saved token: " + savedUser.getVerificationToken());
        
        // Send verification email
        emailService.sendVerificationEmail(savedUser.getEmail(), token);
        
        // Return response
        return new RegistrationResponse(
            true,
            "Registration successful. Please check your email to verify your account.",
            new RegistrationResponse.UserData(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name().toLowerCase(),
                savedUser.getBatch()
            )
        );
    }
    
    @Transactional
    public Map<String, Object> verifyEmail(String token) {
        Map<String, Object> response = new HashMap<>();
        
        System.out.println("🔍 Verifying token: " + token);
        
        Optional<User> userOptional = userRepository.findByVerificationToken(token);
        
        if (userOptional.isEmpty()) {
            System.out.println("❌ No user found with token: " + token);
            response.put("success", false);
            response.put("message", "Invalid verification token.");
            return response;
        }
        
        User user = userOptional.get();
        System.out.println("✅ User found: " + user.getEmail());
        System.out.println("⏰ Token expiry: " + user.getTokenExpiry());
        System.out.println("🕐 Current time: " + LocalDateTime.now());
        
        // Check if token is expired
        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            System.out.println("⏰ Token expired for user: " + user.getEmail());
            response.put("success", false);
            response.put("expired", true);
            response.put("email", user.getEmail());
            response.put("message", "Verification token has expired.");
            return response;
        }
        
        // Token is valid, verify the email
        System.out.println("✅ Token valid, verifying email for: " + user.getEmail());
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);
        
        response.put("success", true);
        response.put("email", user.getEmail());
        response.put("message", "Email verified successfully. You can now log in.");
        System.out.println("✅ Email verified successfully for: " + user.getEmail());
        return response;
    }
    
    public LoginResponse loginUser(LoginRequest request) {
        // Find user by email
        return userRepository.findByEmail(request.getEmail())
            .map(user -> {
                // Check if password matches
                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    return new LoginResponse(
                        false,
                        "Invalid email or password",
                        null,
                        null
                    );
                }
                
                // Check if email is verified
                if (!user.isEmailVerified()) {
                    return new LoginResponse(
                        false,
                        "Please verify your email before logging in",
                        null,
                        null
                    );
                }
                
                // Generate JWT token
                String token = generateToken(user);
                
                // Return success response
                return new LoginResponse(
                    true,
                    "Login successful",
                    token,
                    new LoginResponse.UserData(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name().toLowerCase(),
                        user.getBatch(),
                        user.isEmailVerified()
                    )
                );
            })
            .orElseGet(() -> new LoginResponse(
                false,
                "Invalid email or password",
                null,
                null
            ));
    }
    
    @Transactional
    public Map<String, Object> resendVerificationEmail(String email) {
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Email address is required");
            return response;
        }
        
        System.out.println("🔄 Resending verification email for: " + email);
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            System.out.println("❌ No user found with email: " + email);
            response.put("success", false);
            response.put("message", "No account found with this email address");
            return response;
        }
        
        User user = userOptional.get();
        
        // Check if email is already verified
        if (user.isEmailVerified()) {
            System.out.println("✅ Email already verified for: " + email);
            response.put("success", false);
            response.put("message", "This email is already verified. You can log in to your account.");
            return response;
        }
        
        // Generate new verification token
        String newToken = UUID.randomUUID().toString();
        user.setVerificationToken(newToken);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(5));
        
        System.out.println("🔑 Generated new token: " + newToken);
        System.out.println("⏰ New token expiry set to: " + user.getTokenExpiry());
        
        // Save updated user
        userRepository.save(user);
        
        System.out.println("💾 Updated user with new verification token");
        
        // Send new verification email
        emailService.sendVerificationEmail(user.getEmail(), newToken);
        
        response.put("success", true);
        response.put("message", "A new verification email has been sent. Please check your inbox.");
        System.out.println("✅ Verification email resent successfully to: " + email);
        return response;
    }
    
    private String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);
        
        return Jwts.builder()
            .setSubject(user.getEmail())
            .claim("userId", user.getId())
            .claim("role", user.getRole().name())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SECRET_KEY)
            .compact();
    }
}
