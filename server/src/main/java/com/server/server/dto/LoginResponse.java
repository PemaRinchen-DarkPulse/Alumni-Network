package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private UserData user;
    
    @Data
    @AllArgsConstructor
    public static class UserData {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String batch;
        private boolean emailVerified;
    }
}
