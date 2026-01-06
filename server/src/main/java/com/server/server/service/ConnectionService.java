package com.server.server.service;

import com.server.server.dto.ConnectionDTO;
import com.server.server.model.Connection;
import com.server.server.model.Connection.ConnectionStatus;
import com.server.server.model.User;
import com.server.server.repository.ConnectionRepository;
import com.server.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConnectionService {
    
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    
    /**
     * Send a connection request from sender to receiver
     */
    @Transactional
    public ConnectionDTO sendConnectionRequest(Long senderId, Long receiverId) {
        // Validate users exist
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
            .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        // Cannot send connection request to yourself
        if (senderId.equals(receiverId)) {
            throw new RuntimeException("Cannot send connection request to yourself");
        }
        
        // Check if connection already exists
        Optional<Connection> existingConnection = 
            connectionRepository.findConnectionBetweenUsers(senderId, receiverId);
        
        if (existingConnection.isPresent()) {
            Connection conn = existingConnection.get();
            
            // If connection is PENDING or ACCEPTED, don't allow
            if (conn.getStatus() == ConnectionStatus.PENDING || 
                conn.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new RuntimeException("Connection request already exists");
            }
            
            // If connection is REJECTED
            if (conn.getStatus() == ConnectionStatus.REJECTED) {
                // If the original sender is trying to send again, don't allow
                if (conn.getSender().getId().equals(senderId)) {
                    throw new RuntimeException("You cannot send another request after being rejected");
                }
                
                // If the original receiver (who rejected) wants to send now, allow by updating
                // Flip sender/receiver and set status back to PENDING
                conn.setSender(sender);
                conn.setReceiver(receiver);
                conn.setStatus(ConnectionStatus.PENDING);
                Connection savedConnection = connectionRepository.save(conn);
                return mapToDTO(savedConnection);
            }
        }
        
        // Create new connection request
        Connection connection = new Connection();
        connection.setSender(sender);
        connection.setReceiver(receiver);
        connection.setStatus(ConnectionStatus.PENDING);
        
        Connection savedConnection = connectionRepository.save(connection);
        
        return mapToDTO(savedConnection);
    }
    
    /**
     * Accept a connection request
     */
    @Transactional
    public ConnectionDTO acceptConnectionRequest(Long connectionId, Long userId) {
        Connection connection = connectionRepository.findById(connectionId)
            .orElseThrow(() -> new RuntimeException("Connection request not found"));
        
        // Only the receiver can accept the request
        if (!connection.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Only the receiver can accept this request");
        }
        
        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Connection request is not pending");
        }
        
        connection.setStatus(ConnectionStatus.ACCEPTED);
        Connection savedConnection = connectionRepository.save(connection);
        
        return mapToDTO(savedConnection);
    }
    
    /**
     * Reject a connection request
     */
    @Transactional
    public ConnectionDTO rejectConnectionRequest(Long connectionId, Long userId) {
        Connection connection = connectionRepository.findById(connectionId)
            .orElseThrow(() -> new RuntimeException("Connection request not found"));
        
        // Only the receiver can reject the request
        if (!connection.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Only the receiver can reject this request");
        }
        
        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Connection request is not pending");
        }
        
        connection.setStatus(ConnectionStatus.REJECTED);
        Connection savedConnection = connectionRepository.save(connection);
        
        return mapToDTO(savedConnection);
    }
    
    /**
     * Withdraw a sent connection request (sender cancels their own request)
     * This will DELETE the connection from the database
     */
    @Transactional
    public void withdrawConnectionRequest(Long connectionId, Long userId) {
        Connection connection = connectionRepository.findById(connectionId)
            .orElseThrow(() -> new RuntimeException("Connection request not found"));
        
        // Only the sender can withdraw the request
        if (!connection.getSender().getId().equals(userId)) {
            throw new RuntimeException("Only the sender can withdraw this request");
        }
        
        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Connection request is not pending");
        }
        
        // Delete the connection from database
        connectionRepository.delete(connection);
    }
    
    /**
     * Get all pending connection requests received by a user
     */
    public List<ConnectionDTO> getPendingRequestsReceived(Long userId) {
        List<Connection> connections = 
            connectionRepository.findByReceiverIdAndStatus(userId, ConnectionStatus.PENDING);
        
        return connections.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all pending connection requests sent by a user
     */
    public List<ConnectionDTO> getPendingRequestsSent(Long userId) {
        List<Connection> connections = 
            connectionRepository.findBySenderIdAndStatus(userId, ConnectionStatus.PENDING);
        
        return connections.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all accepted connections for a user
     */
    public List<ConnectionDTO> getAcceptedConnections(Long userId) {
        List<Connection> connections = 
            connectionRepository.findAllConnectionsByUserAndStatus(userId, ConnectionStatus.ACCEPTED);
        
        return connections.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get connection status between two users
     */
    public String getConnectionStatus(Long userId1, Long userId2) {
        Optional<Connection> connection = 
            connectionRepository.findConnectionBetweenUsers(userId1, userId2);
        
        if (connection.isEmpty()) {
            return "NONE";
        }
        
        return connection.get().getStatus().toString();
    }
    
    /**
     * Check if connection exists between two users
     */
    public boolean hasConnection(Long userId1, Long userId2) {
        return connectionRepository.existsConnectionBetweenUsers(userId1, userId2);
    }
    
    /**
     * Map Connection entity to DTO
     */
    private ConnectionDTO mapToDTO(Connection connection) {
        ConnectionDTO dto = new ConnectionDTO();
        dto.setId(connection.getId());
        dto.setSenderId(connection.getSender().getId());
        dto.setSenderName(connection.getSender().getName());
        dto.setSenderEmail(connection.getSender().getEmail());
        dto.setReceiverId(connection.getReceiver().getId());
        dto.setReceiverName(connection.getReceiver().getName());
        dto.setReceiverEmail(connection.getReceiver().getEmail());
        dto.setStatus(connection.getStatus());
        dto.setCreatedAt(connection.getCreatedAt());
        dto.setUpdatedAt(connection.getUpdatedAt());
        return dto;
    }
}
