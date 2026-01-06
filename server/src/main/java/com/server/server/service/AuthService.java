package com.server.server.service;

import com.server.server.dto.LoginRequest;
import com.server.server.dto.LoginResponse;
import com.server.server.dto.RegistrationRequest;
import com.server.server.dto.RegistrationResponse;
import com.server.server.model.User;
import com.server.server.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    
    @Transactional
    public RegistrationResponse registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration attempt with existing email: {}", request.getEmail());
            return new RegistrationResponse(
                false,
                "Email already registered",
                null
            );
        }
        
        if ((request.getRole() == User.Role.STUDENT || request.getRole() == User.Role.ALUMNI) 
            && (request.getBatch() == null || request.getBatch().trim().isEmpty())) {
            log.warn("Registration attempt without batch for role: {}", request.getRole());
            return new RegistrationResponse(
                false,
                "Batch is required for students and alumni",
                null
            );
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setBatch(request.getBatch());
        user.setEmailVerified(false);
        
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());
        
        emailService.sendVerificationEmail(savedUser.getEmail(), token);
        log.info("Verification email sent to: {}", savedUser.getEmail());
        
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
        
        log.debug("Attempting email verification with token");
        
        Optional<User> userOptional = userRepository.findByVerificationToken(token);
        
        if (userOptional.isEmpty()) {
            log.warn("Invalid verification token provided");
            response.put("success", false);
            response.put("message", "Invalid verification token.");
            return response;
        }
        
        User user = userOptional.get();
        log.debug("User found for verification: {}", user.getEmail());
        
        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            log.warn("Verification token expired for user: {}", user.getEmail());
            response.put("success", false);
            response.put("expired", true);
            response.put("email", user.getEmail());
            response.put("message", "Verification token has expired.");
            return response;
        }
        
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);
        
        log.info("Email verified successfully for user: {}", user.getEmail());
        
        response.put("success", true);
        response.put("email", user.getEmail());
        response.put("message", "Email verified successfully. You can now log in.");
        return response;
    }
    
    
    public LoginResponse loginUser(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
            .map(user -> {
                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    log.warn("Failed login attempt for email: {}", request.getEmail());
                    return new LoginResponse(
                        false,
                        "Invalid email or password",
                        null,
                        null
                    );
                }
                
                if (!user.isEmailVerified()) {
                    log.warn("Login attempt with unverified email: {}", request.getEmail());
                    return new LoginResponse(
                        false,
                        "Please verify your email before logging in",
                        null,
                        null
                    );
                }
                
                String token = generateToken(user);
                log.info("User logged in successfully: {}", user.getEmail());
                
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
            .orElseGet(() -> {
                log.warn("Login attempt with non-existent email: {}", request.getEmail());
                return new LoginResponse(
                    false,
                    "Invalid email or password",
                    null,
                    null
                );
            });
    }
    
    
    @Transactional
    public Map<String, Object> resendVerificationEmail(String email) {
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.trim().isEmpty()) {
            log.warn("Resend verification attempt with empty email");
            response.put("success", false);
            response.put("message", "Email address is required");
            return response;
        }
        
        log.debug("Resending verification email for: {}", email);
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            log.warn("Resend verification attempt for non-existent email: {}", email);
            response.put("success", false);
            response.put("message", "No account found with this email address");
            return response;
        }
        
        User user = userOptional.get();
        
        if (user.isEmailVerified()) {
            log.info("Resend verification attempt for already verified email: {}", email);
            response.put("success", false);
            response.put("message", "This email is already verified. You can log in to your account.");
            return response;
        }
        
        String newToken = UUID.randomUUID().toString();
        user.setVerificationToken(newToken);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));
        
        userRepository.save(user);
        log.info("New verification token generated for: {}", email);
        
        emailService.sendVerificationEmail(user.getEmail(), newToken);
        
        response.put("success", true);
        response.put("message", "A new verification email has been sent. Please check your inbox.");
        log.info("Verification email resent successfully to: {}", email);
        return response;
    }
    
    @Transactional
    public Map<String, Object> forgotPassword(String email) {
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.trim().isEmpty()) {
            log.warn("Forgot password attempt with empty email");
            response.put("success", false);
            response.put("message", "Email address is required");
            return response;
        }
        
        log.debug("Processing forgot password request for: {}", email);
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            log.warn("Forgot password attempt for non-existent email: {}", email);
            response.put("success", false);
            response.put("message", "No account found with this email address. Please check your email or register for a new account.");
            return response;
        }
        
        User user = userOptional.get();
        
        if (!user.isEmailVerified()) {
            log.warn("Forgot password attempt for unverified email: {}", email);
            response.put("success", false);
            response.put("message", "Your email is not verified. Please verify your email first before resetting your password.");
            return response;
        }
        
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        
        userRepository.save(user);
        log.info("Password reset token generated for: {}", email);
        
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        
        response.put("success", true);
        response.put("message", "Password reset instructions have been sent to your email. Please check your inbox.");
        log.info("Password reset email sent successfully to: {}", email);
        return response;
    }
    
    @Transactional
    public Map<String, Object> resetPassword(String token, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        
        if (token == null || token.trim().isEmpty()) {
            log.warn("Reset password attempt with empty token");
            response.put("success", false);
            response.put("message", "Reset token is required");
            return response;
        }
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            log.warn("Reset password attempt with empty password");
            response.put("success", false);
            response.put("message", "New password is required");
            return response;
        }
        
        log.debug("Processing password reset with token");
        
        Optional<User> userOptional = userRepository.findByResetToken(token);
        
        if (userOptional.isEmpty()) {
            log.warn("Invalid reset token provided");
            response.put("success", false);
            response.put("message", "Invalid or expired reset token. Please request a new password reset.");
            return response;
        }
        
        User user = userOptional.get();
        
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            log.warn("Expired reset token for user: {}", user.getEmail());
            response.put("success", false);
            response.put("message", "Reset token has expired. Please request a new password reset.");
            return response;
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        
        userRepository.save(user);
        log.info("Password reset successfully for user: {}", user.getEmail());
        
        response.put("success", true);
        response.put("message", "Your password has been reset successfully. You can now log in with your new password.");
        return response;
    }
    
    public Map<String, Object> validatePasswordResetToken(String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token == null || token.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Reset token is required");
            return response;
        }
        
        Optional<User> userOptional = userRepository.findByResetToken(token);
        
        if (userOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid reset token");
            return response;
        }
        
        User user = userOptional.get();
        
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            response.put("success", false);
            response.put("message", "Reset token has expired");
            return response;
        }
        
        response.put("success", true);
        response.put("message", "Token is valid");
        return response;
    }
    
    private String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
            .subject(user.getEmail())
            .claim("userId", user.getId())
            .claim("role", user.getRole().name())
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(getSigningKey())
            .compact();
    }
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
