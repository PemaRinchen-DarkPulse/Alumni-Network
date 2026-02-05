package com.server.server.service;

import com.server.server.dto.QuestionDTO;
import com.server.server.dto.QuestionRequest;
import com.server.server.model.Question;
import com.server.server.model.Question.QuestionStatus;
import com.server.server.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    
    @Transactional
    public QuestionDTO saveDraft(QuestionRequest request) {
        log.info("Saving question draft: {}", request.getTitle());
        
        Question question = new Question();
        updateQuestionFromRequest(question, request);
        question.setStatus(QuestionStatus.DRAFT);
        
        Question savedQuestion = questionRepository.save(question);
        log.info("Draft saved successfully with ID: {}", savedQuestion.getId());
        
        return QuestionDTO.fromEntity(savedQuestion);
    }
    
    @Transactional
    public QuestionDTO publishQuestion(QuestionRequest request) {
        log.info("Publishing question: {}", request.getTitle());
        
        Question question = new Question();
        updateQuestionFromRequest(question, request);
        question.setStatus(QuestionStatus.PUBLISHED);
        question.setPublishedAt(LocalDateTime.now());
        
        Question savedQuestion = questionRepository.save(question);
        log.info("Question published successfully with ID: {}", savedQuestion.getId());
        
        return QuestionDTO.fromEntity(savedQuestion);
    }
    
    public List<QuestionDTO> getAllPublishedQuestions() {
        log.info("Fetching all published questions");
        List<Question> questions = questionRepository.findByStatusOrderByCreatedAtDesc(QuestionStatus.PUBLISHED);
        return questions.stream()
                .map(QuestionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<QuestionDTO> getQuestionsByCategory(String category) {
        log.info("Fetching questions for category: {}", category);
        List<Question> questions = questionRepository.findByCategoryAndStatusOrderByCreatedAtDesc(
                category, QuestionStatus.PUBLISHED);
        return questions.stream()
                .map(QuestionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<QuestionDTO> getUserQuestions(Long userId) {
        log.info("Fetching questions for user: {}", userId);
        List<Question> questions = questionRepository.findByAuthorIdOrderByCreatedAtDesc(userId);
        return questions.stream()
                .map(QuestionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<QuestionDTO> getPopularQuestions() {
        log.info("Fetching popular questions");
        List<Question> questions = questionRepository.findPopularQuestions(QuestionStatus.PUBLISHED);
        return questions.stream()
                .map(QuestionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<QuestionDTO> getUnansweredQuestions() {
        log.info("Fetching unanswered questions");
        List<Question> questions = questionRepository.findUnansweredQuestions(QuestionStatus.PUBLISHED);
        return questions.stream()
                .map(QuestionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public QuestionDTO getQuestionById(Long id) {
        log.info("Fetching question with ID: {}", id);
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        
        // Increment view count
        question.setViewCount(question.getViewCount() + 1);
        questionRepository.save(question);
        
        return QuestionDTO.fromEntity(question);
    }
    
    @Transactional
    public void deleteQuestion(Long id) {
        log.info("Deleting question with ID: {}", id);
        questionRepository.deleteById(id);
    }
    
    private void updateQuestionFromRequest(Question question, QuestionRequest request) {
        question.setTitle(request.getTitle());
        question.setDescription(request.getDescription());
        question.setCategory(request.getCategory());
        question.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());
        question.setAuthorId(request.getAuthorId());
        question.setAuthorName(request.getAuthorName());
        question.setAnonymous(request.isAnonymous());
    }
}
