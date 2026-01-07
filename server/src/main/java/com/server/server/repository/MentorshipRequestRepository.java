package com.server.server.repository;

import com.server.server.model.MentorshipRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {
    List<MentorshipRequest> findByMenteeId(Long menteeId);
    List<MentorshipRequest> findByMentorId(Long mentorId);
    List<MentorshipRequest> findByMentorIdAndStatus(Long mentorId, MentorshipRequest.RequestStatus status);
    Optional<MentorshipRequest> findByMenteeIdAndMentorIdAndStatus(Long menteeId, Long mentorId, MentorshipRequest.RequestStatus status);
    boolean existsByMenteeIdAndMentorIdAndStatus(Long menteeId, Long mentorId, MentorshipRequest.RequestStatus status);
    boolean existsByMenteeIdAndMentorIdAndTopicAndStatus(Long menteeId, Long mentorId, String topic, MentorshipRequest.RequestStatus status);
}
