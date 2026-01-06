package com.server.server.repository;

import com.server.server.model.Connection;
import com.server.server.model.Connection.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    
    // Find connection between two users regardless of who sent the request
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.sender.id = :userId1 AND c.receiver.id = :userId2) OR " +
           "(c.sender.id = :userId2 AND c.receiver.id = :userId1)")
    Optional<Connection> findConnectionBetweenUsers(
        @Param("userId1") Long userId1, 
        @Param("userId2") Long userId2
    );
    
    // Find all connections for a user (both sent and received)
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.sender.id = :userId OR c.receiver.id = :userId) " +
           "AND c.status = :status")
    List<Connection> findAllConnectionsByUserAndStatus(
        @Param("userId") Long userId, 
        @Param("status") ConnectionStatus status
    );
    
    // Find pending connection requests received by a user
    List<Connection> findByReceiverIdAndStatus(Long receiverId, ConnectionStatus status);
    
    // Find pending connection requests sent by a user
    List<Connection> findBySenderIdAndStatus(Long senderId, ConnectionStatus status);
    
    // Check if connection exists between two users
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Connection c WHERE " +
           "(c.sender.id = :userId1 AND c.receiver.id = :userId2) OR " +
           "(c.sender.id = :userId2 AND c.receiver.id = :userId1)")
    boolean existsConnectionBetweenUsers(
        @Param("userId1") Long userId1, 
        @Param("userId2") Long userId2
    );
}
