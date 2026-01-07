package com.server.server.service;

import com.server.server.dto.MentorshipRequestDTO;
import com.server.server.dto.MentorshipRequestRequest;
import com.server.server.model.MentorshipRequest;
import com.server.server.model.User;
import com.server.server.repository.MentorshipRequestRepository;
import com.server.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorshipRequestService {
    
    private final MentorshipRequestRepository mentorshipRequestRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public MentorshipRequestDTO createRequest(MentorshipRequestRequest request) {
        log.info("Creating mentorship request from mentee {} to mentor {}", 
                 request.getMenteeId(), request.getMentorId());
        
        // Validate that mentee and mentor exist
        User mentee = userRepository.findById(request.getMenteeId())
                .orElseThrow(() -> new RuntimeException("Mentee not found"));
        
        User mentor = userRepository.findById(request.getMentorId())
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        
        // Check if there's already a pending request
        boolean existingPendingRequest = mentorshipRequestRepository.existsByMenteeIdAndMentorIdAndStatus(
                request.getMenteeId(), 
                request.getMentorId(), 
                MentorshipRequest.RequestStatus.PENDING
        );
        
        if (existingPendingRequest) {
            throw new RuntimeException("You already have a pending request to this mentor");
        }
        
        // Check if there's already an accepted request
        boolean existingAcceptedRequest = mentorshipRequestRepository.existsByMenteeIdAndMentorIdAndStatus(
                request.getMenteeId(), 
                request.getMentorId(), 
                MentorshipRequest.RequestStatus.ACCEPTED
        );
        
        if (existingAcceptedRequest) {
            throw new RuntimeException("You already have an accepted mentorship with this mentor");
        }
        
        // Check if there's a rejected request with the same topic
        boolean rejectedSameTopic = mentorshipRequestRepository.existsByMenteeIdAndMentorIdAndTopicAndStatus(
                request.getMenteeId(), 
                request.getMentorId(), 
                request.getTopic(),
                MentorshipRequest.RequestStatus.REJECTED
        );
        
        if (rejectedSameTopic) {
            throw new RuntimeException("You cannot send a request for the same topic that was previously rejected. Please choose a different topic.");
        }
        
        // Create new request
        MentorshipRequest mentorshipRequest = new MentorshipRequest();
        mentorshipRequest.setMenteeId(request.getMenteeId());
        mentorshipRequest.setMentorId(request.getMentorId());
        mentorshipRequest.setTopic(request.getTopic());
        mentorshipRequest.setMessage(request.getMessage());
        mentorshipRequest.setStatus(MentorshipRequest.RequestStatus.PENDING);
        
        MentorshipRequest savedRequest = mentorshipRequestRepository.save(mentorshipRequest);
        log.info("Mentorship request created successfully with ID: {}", savedRequest.getId());
        
        return MentorshipRequestDTO.fromEntity(savedRequest);
    }
    
    public List<MentorshipRequestDTO> getRequestsByMentee(Long menteeId) {
        log.info("Fetching mentorship requests for mentee: {}", menteeId);
        
        List<MentorshipRequest> requests = mentorshipRequestRepository.findByMenteeId(menteeId);
        
        return requests.stream()
                .map(MentorshipRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<MentorshipRequestDTO> getRequestsByMentor(Long mentorId, String status) {
        log.info("Fetching mentorship requests for mentor: {} with status: {}", mentorId, status);
        
        List<MentorshipRequest> requests;
        if (status != null && !status.isEmpty()) {
            MentorshipRequest.RequestStatus requestStatus = MentorshipRequest.RequestStatus.valueOf(status.toUpperCase());
            requests = mentorshipRequestRepository.findByMentorIdAndStatus(mentorId, requestStatus);
        } else {
            requests = mentorshipRequestRepository.findByMentorId(mentorId);
        }
        
        return requests.stream()
                .map(request -> {
                    User mentee = userRepository.findById(request.getMenteeId()).orElse(null);
                    return MentorshipRequestDTO.fromEntityWithMenteeDetails(request, mentee);
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public MentorshipRequestDTO updateRequestStatus(Long requestId, String status) {
        log.info("Updating mentorship request {} to status: {}", requestId, status);
        
        MentorshipRequest request = mentorshipRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Mentorship request not found"));
        
        MentorshipRequest.RequestStatus newStatus = MentorshipRequest.RequestStatus.valueOf(status.toUpperCase());
        request.setStatus(newStatus);
        
        MentorshipRequest updatedRequest = mentorshipRequestRepository.save(request);
        log.info("Mentorship request status updated successfully");
        
        return MentorshipRequestDTO.fromEntity(updatedRequest);
    }
}
