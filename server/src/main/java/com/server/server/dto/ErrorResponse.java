package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private boolean success;
    private String message;
    private List<String> errors;
    private LocalDateTime timestamp;
    
    public ErrorResponse(String message, List<String> errors) {
        this.success = false;
        this.message = message;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }
}
