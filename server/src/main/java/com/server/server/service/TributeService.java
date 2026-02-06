package com.server.server.service;

import com.server.server.dto.TributeDTO;
import com.server.server.dto.TributeRequest;
import com.server.server.model.Tribute;
import com.server.server.repository.TributeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TributeService {
    
    private final TributeRepository tributeRepository;
    
    @Transactional
    public TributeDTO createTribute(TributeRequest request) {
        log.info("Creating tribute for teacher: {}", request.getTeacherName());
        
        Tribute tribute = new Tribute();
        tribute.setTeacherName(request.getTeacherName());
        tribute.setDepartment(request.getDepartment());
        tribute.setSubject(request.getSubject());
        tribute.setYearsFrom(request.getYearsFrom());
        tribute.setYearsTo(request.getYearsTo());
        tribute.setMessage(request.getMessage());
        tribute.setAuthorId(request.getAuthorId());
        tribute.setAuthorName(request.getAuthorName());
        tribute.setStatus(Tribute.TributeStatus.PUBLISHED); // Auto-publish for now
        tribute.setPublishedAt(LocalDateTime.now());
        
        Tribute savedTribute = tributeRepository.save(tribute);
        log.info("Tribute created successfully with ID: {}", savedTribute.getId());
        
        return TributeDTO.fromEntity(savedTribute);
    }
    
    @Transactional
    public TributeDTO updateTribute(Long id, TributeRequest request) {
        log.info("Updating tribute with ID: {}", id);
        
        Tribute tribute = tributeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tribute not found with ID: " + id));
        
        tribute.setTeacherName(request.getTeacherName());
        tribute.setDepartment(request.getDepartment());
        tribute.setSubject(request.getSubject());
        tribute.setYearsFrom(request.getYearsFrom());
        tribute.setYearsTo(request.getYearsTo());
        tribute.setMessage(request.getMessage());
        
        Tribute updatedTribute = tributeRepository.save(tribute);
        log.info("Tribute updated successfully");
        
        return TributeDTO.fromEntity(updatedTribute);
    }
    
    @Transactional
    public void deleteTribute(Long id) {
        log.info("Deleting tribute with ID: {}", id);
        
        if (!tributeRepository.existsById(id)) {
            throw new RuntimeException("Tribute not found with ID: " + id);
        }
        
        tributeRepository.deleteById(id);
        log.info("Tribute deleted successfully");
    }
    
    @Transactional(readOnly = true)
    public TributeDTO getTributeById(Long id) {
        log.info("Fetching tribute with ID: {}", id);
        
        Tribute tribute = tributeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tribute not found with ID: " + id));
        
        return TributeDTO.fromEntity(tribute);
    }
    
    @Transactional(readOnly = true)
    public List<TributeDTO> getAllPublishedTributes() {
        log.info("Fetching all published tributes");
        
        List<Tribute> tributes = tributeRepository
                .findByStatusOrderByCreatedAtDesc(Tribute.TributeStatus.PUBLISHED);
        
        return tributes.stream()
                .map(TributeDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TributeDTO> getAllPendingTributes() {
        log.info("Fetching all pending tributes");
        
        List<Tribute> tributes = tributeRepository
                .findByStatusOrderByCreatedAtDesc(Tribute.TributeStatus.PENDING);
        
        return tributes.stream()
                .map(TributeDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TributeDTO> getTributesByAuthor(Long authorId) {
        log.info("Fetching tributes by author ID: {}", authorId);
        
        List<Tribute> tributes = tributeRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
        
        return tributes.stream()
                .map(TributeDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TributeDTO> searchTributesByTeacherName(String teacherName) {
        log.info("Searching tributes by teacher name: {}", teacherName);
        
        List<Tribute> tributes = tributeRepository
                .findByTeacherNameContainingIgnoreCaseAndStatusOrderByCreatedAtDesc(
                        teacherName, Tribute.TributeStatus.PUBLISHED);
        
        return tributes.stream()
                .map(TributeDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TributeDTO> getTributesByDepartment(String department) {
        log.info("Fetching tributes by department: {}", department);
        
        List<Tribute> tributes = tributeRepository
                .findByDepartmentAndStatusOrderByCreatedAtDesc(
                        department, Tribute.TributeStatus.PUBLISHED);
        
        return tributes.stream()
                .map(TributeDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TributeDTO publishTribute(Long id) {
        log.info("Publishing tribute with ID: {}", id);
        
        Tribute tribute = tributeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tribute not found with ID: " + id));
        
        if (tribute.getStatus() != Tribute.TributeStatus.PENDING) {
            throw new RuntimeException("Only pending tributes can be published");
        }
        
        tribute.setStatus(Tribute.TributeStatus.PUBLISHED);
        tribute.setPublishedAt(LocalDateTime.now());
        
        Tribute publishedTribute = tributeRepository.save(tribute);
        log.info("Tribute published successfully");
        
        return TributeDTO.fromEntity(publishedTribute);
    }
    
    @Transactional
    public TributeDTO likeTribute(Long id) {
        log.info("Liking tribute with ID: {}", id);
        
        Tribute tribute = tributeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tribute not found with ID: " + id));
        
        tribute.setLikeCount(tribute.getLikeCount() + 1);
        
        Tribute updatedTribute = tributeRepository.save(tribute);
        log.info("Tribute liked successfully. New like count: {}", updatedTribute.getLikeCount());
        
        return TributeDTO.fromEntity(updatedTribute);
    }
    
    @Transactional
    public TributeDTO unlikeTribute(Long id) {
        log.info("Unliking tribute with ID: {}", id);
        
        Tribute tribute = tributeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tribute not found with ID: " + id));
        
        if (tribute.getLikeCount() > 0) {
            tribute.setLikeCount(tribute.getLikeCount() - 1);
        }
        
        Tribute updatedTribute = tributeRepository.save(tribute);
        log.info("Tribute unliked successfully. New like count: {}", updatedTribute.getLikeCount());
        
        return TributeDTO.fromEntity(updatedTribute);
    }
}
