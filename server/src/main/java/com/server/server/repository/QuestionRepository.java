package com.server.server.repository;

import com.server.server.model.Question;
import com.server.server.model.Question.QuestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByStatusOrderByCreatedAtDesc(QuestionStatus status);
    
    List<Question> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    List<Question> findByCategoryAndStatusOrderByCreatedAtDesc(String category, QuestionStatus status);
    
    @Query("SELECT q FROM Question q WHERE q.status = :status ORDER BY q.upvoteCount DESC, q.createdAt DESC")
    List<Question> findPopularQuestions(QuestionStatus status);
    
    @Query("SELECT q FROM Question q WHERE q.status = :status AND q.answerCount = 0 ORDER BY q.createdAt DESC")
    List<Question> findUnansweredQuestions(QuestionStatus status);
}
