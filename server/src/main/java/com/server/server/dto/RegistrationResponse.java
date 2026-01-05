package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegistrationResponse {
    private boolean success;
    private String message;
    private UserData data;
    
    @Data
    @AllArgsConstructor
    public static class UserData {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String batch;
    }
}
