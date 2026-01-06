package com.server.server.dto;

import com.server.server.model.Connection.ConnectionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionDTO {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderEmail;
    private Long receiverId;
    private String receiverName;
    private String receiverEmail;
    private ConnectionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
