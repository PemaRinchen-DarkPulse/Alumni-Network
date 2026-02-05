package com.server.server.controller;

import com.server.server.dto.QuestionDTO;
import com.server.server.dto.QuestionRequest;
import com.server.server.service.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class QuestionController {
    
    private final QuestionService questionService;
    
    @PostMapping("/draft")
    @PreAuthorize("hasAnyAuthority('STUDENT', 'ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> saveDraft(@RequestBody QuestionRequest request) {
        log.info("Received request to save question draft: {}", request.getTitle());
        log.debug("Full request: {}", request);
        
        try {
            QuestionDTO question = questionService.saveDraft(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", question,
                "message", "Question draft saved successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving question draft: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to save question draft: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/publish")
    @PreAuthorize("hasAnyAuthority('STUDENT', 'ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> publishQuestion(@RequestBody QuestionRequest request) {
        log.info("Received request to publish question: {}", request.getTitle());
        log.debug("Full request: {}", request);
        
        try {
            QuestionDTO question = questionService.publishQuestion(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", question,
                "message", "Question published successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing question: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish question: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllQuestions() {
        log.info("Received request to get all published questions");
        
        try {
            List<QuestionDTO> questions = questionService.getAllPublishedQuestions();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", questions
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching questions: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch questions: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getQuestionsByCategory(@PathVariable String category) {
        log.info("Received request to get questions for category: {}", category);
        
        try {
            List<QuestionDTO> questions = questionService.getQuestionsByCategory(category);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", questions
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching questions by category: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch questions: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('STUDENT', 'ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> getUserQuestions(@PathVariable Long userId) {
        log.info("Received request to get questions for user: {}", userId);
        
        try {
            List<QuestionDTO> questions = questionService.getUserQuestions(userId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", questions
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching user questions: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch user questions: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularQuestions() {
        log.info("Received request to get popular questions");
        
        try {
            List<QuestionDTO> questions = questionService.getPopularQuestions();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", questions
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching popular questions: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch popular questions: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/unanswered")
    public ResponseEntity<Map<String, Object>> getUnansweredQuestions() {
        log.info("Received request to get unanswered questions");
        
        try {
            List<QuestionDTO> questions = questionService.getUnansweredQuestions();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", questions
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching unanswered questions: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch unanswered questions: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getQuestionById(@PathVariable Long id) {
        log.info("Received request to get question with ID: {}", id);
        
        try {
            QuestionDTO question = questionService.getQuestionById(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", question
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching question: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch question: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('STUDENT', 'ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> deleteQuestion(@PathVariable Long id) {
        log.info("Received request to delete question with ID: {}", id);
        
        try {
            questionService.deleteQuestion(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Question deleted successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting question: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to delete question: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
