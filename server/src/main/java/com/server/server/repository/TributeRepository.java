package com.server.server.repository;

import com.server.server.model.Tribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TributeRepository extends JpaRepository<Tribute, Long> {
    
    List<Tribute> findByStatusOrderByCreatedAtDesc(Tribute.TributeStatus status);
    
    List<Tribute> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    List<Tribute> findByAuthorIdAndStatusOrderByCreatedAtDesc(Long authorId, Tribute.TributeStatus status);
    
    List<Tribute> findByTeacherNameContainingIgnoreCaseAndStatusOrderByCreatedAtDesc(
            String teacherName, Tribute.TributeStatus status);
    
    List<Tribute> findByDepartmentAndStatusOrderByCreatedAtDesc(
            String department, Tribute.TributeStatus status);
}
