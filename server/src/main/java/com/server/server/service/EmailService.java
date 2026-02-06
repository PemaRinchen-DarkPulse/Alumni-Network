package com.server.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${brevo.api.key}")
    private String brevoApiKey;
    
    @Value("${brevo.api.url}")
    private String brevoApiUrl;
    
    @Value("${app.mail.from.email}")
    private String fromEmail;
    
    @Value("${app.mail.from.name}")
    private String fromName;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    /**
     * Send verification email to user using Brevo API
     * @param toEmail User's email address
     * @param token Verification token
     */
    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String verificationLink = frontendUrl + "/verify-email?token=" + token;
            
            String htmlContent = String.format(
                "<html><body>" +
                "<h2>Welcome to Alumni Network!</h2>" +
                "<p>Thank you for registering with us.</p>" +
                "<p>Please click the button below to verify your email address:</p>" +
                "<div style='margin: 30px 0;'>" +
                "<a href='%s' style='background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;'>Verify Email</a>" +
                "</div>" +
                "<p>Or copy and paste this link in your browser:</p>" +
                "<p><a href='%s'>%s</a></p>" +
                "<p style='color: #666; font-size: 12px; margin-top: 30px;'>This link will expire in 24 hours.</p>" +
                "<p style='color: #666; font-size: 12px;'>If you didn't create an account, please ignore this email.</p>" +
                "</body></html>",
                verificationLink, verificationLink, verificationLink
            );
            
            sendBrevoEmail(toEmail, "Verify Your Email - Alumni Network", htmlContent);
            System.out.println("✅ Verification email sent successfully to: " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send verification email to: " + toEmail);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send password reset email to user
     * @param toEmail User's email address
     * @param token Reset token
     */
    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            
            String htmlContent = String.format(
                "<html><body>" +
                "<h2>Password Reset Request</h2>" +
                "<p>We received a request to reset your password.</p>" +
                "<p>Please click the button below to reset your password:</p>" +
                "<div style='margin: 30px 0;'>" +
                "<a href='%s' style='background-color: #f44336; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;'>Reset Password</a>" +
                "</div>" +
                "<p>Or copy and paste this link in your browser:</p>" +
                "<p><a href='%s'>%s</a></p>" +
                "<p style='color: #666; font-size: 12px; margin-top: 30px;'>This link will expire in 1 hour.</p>" +
                "<p style='color: #666; font-size: 12px;'>If you didn't request a password reset, please ignore this email.</p>" +
                "</body></html>",
                resetLink, resetLink, resetLink
            );
            
            sendBrevoEmail(toEmail, "Password Reset Request - Alumni Network", htmlContent);
            System.out.println("✅ Password reset email sent successfully to: " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email to: " + toEmail);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send welcome email after email verification
     * @param toEmail User's email address
     * @param userName User's name
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            String loginLink = frontendUrl + "/login";
            
            String htmlContent = String.format(
                "<html><body>" +
                "<h2>Welcome to Alumni Network! 🎉</h2>" +
                "<p>Dear %s,</p>" +
                "<p>Your email has been successfully verified and your account is now active.</p>" +
                "<p>You can now log in and start connecting with fellow alumni.</p>" +
                "<div style='margin: 30px 0;'>" +
                "<a href='%s' style='background-color: #2196F3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;'>Login Now</a>" +
                "</div>" +
                "<p>Best regards,<br>Alumni Network Team</p>" +
                "</body></html>",
                userName, loginLink
            );
            
            sendBrevoEmail(toEmail, "Welcome to Alumni Network!", htmlContent);
            System.out.println("✅ Welcome email sent successfully to: " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send welcome email to: " + toEmail);
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    /**
     * Send email using Brevo API
     * @param toEmail Recipient email
     * @param subject Email subject
     * @param htmlContent HTML content
     */
    private void sendBrevoEmail(String toEmail, String subject, String htmlContent) {
        try {
            // Validate API key
            if (brevoApiKey == null || brevoApiKey.isEmpty() || brevoApiKey.equals("YOUR_BREVO_API_KEY")) {
                System.err.println("❌ Brevo API key is not configured properly!");
                System.err.println("Please set brevo.api.key in application.properties");
                return;
            }
            
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);
            
            System.out.println("🔑 Using API key: " + brevoApiKey.substring(0, 10) + "...");
            
            // Create email payload
            Map<String, Object> sender = new HashMap<>();
            sender.put("name", fromName);
            sender.put("email", fromEmail);
            
            Map<String, Object> recipient = new HashMap<>();
            recipient.put("email", toEmail);
            
            Map<String, Object> emailData = new HashMap<>();
            emailData.put("sender", sender);
            emailData.put("to", new Object[]{recipient});
            emailData.put("subject", subject);
            emailData.put("htmlContent", htmlContent);
            
            // Create request entity
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(emailData, headers);
            
            // Send request to Brevo API
            ResponseEntity<String> response = restTemplate.exchange(
                brevoApiUrl,
                HttpMethod.POST,
                request,
                String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ Email sent via Brevo API");
            } else {
                System.err.println("❌ Failed to send email. Status: " + response.getStatusCode());
                System.err.println("Response body: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("❌ Exception while sending email via Brevo API");
            System.err.println("Error message: " + e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("401")) {
                System.err.println("⚠️  401 Unauthorized - Your API key is invalid or not configured correctly");
                System.err.println("⚠️  Make sure you're using an API key (starts with 'xkeysib-'), not an SMTP key");
                System.err.println("⚠️  Current key type: " + (brevoApiKey.startsWith("xkeysib-") ? "API key ✓" : "SMTP key (wrong type!)"));
            }
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
