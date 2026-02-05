package com.server.server.controller;

import com.server.server.dto.BlogPostDTO;
import com.server.server.dto.BlogPostRequest;
import com.server.server.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class BlogPostController {
    
    private final BlogPostService blogPostService;
    
    @PostMapping("/draft")
    // @PreAuthorize("hasAnyAuthority('ALUMNI', 'TEACHER')") // Disabled for development
    public ResponseEntity<Map<String, Object>> saveDraft(@RequestBody BlogPostRequest request) {
        log.info("Received request to save blog post draft: {}", request.getTitle());
        
        try {
            BlogPostDTO blogPost = blogPostService.saveDraft(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", blogPost,
                "message", "Blog post draft saved successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving blog post draft: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to save blog post draft: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/publish")
    // @PreAuthorize("hasAnyAuthority('ALUMNI', 'TEACHER')") // Disabled for development
    public ResponseEntity<Map<String, Object>> publishBlogPost(@RequestBody BlogPostRequest request) {
        log.info("Received request to publish blog post: {}", request.getTitle());
        
        try {
            BlogPostDTO blogPost = blogPostService.publishBlogPost(request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", blogPost,
                "message", "Blog post published successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing blog post: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish blog post: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> updateBlogPost(
            @PathVariable Long id,
            @RequestBody BlogPostRequest request) {
        log.info("Received request to update blog post with ID: {}", id);
        
        try {
            BlogPostDTO blogPost = blogPostService.updateBlogPost(id, request);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", blogPost,
                "message", "Blog post updated successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating blog post: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to update blog post: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyAuthority('ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> publishDraft(@PathVariable Long id) {
        log.info("Received request to publish draft with ID: {}", id);
        
        try {
            BlogPostDTO blogPost = blogPostService.publishDraft(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", blogPost,
                "message", "Draft published successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing draft: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to publish draft: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBlogPostById(@PathVariable Long id) {
        log.info("Received request to get blog post with ID: {}", id);
        
        try {
            BlogPostDTO blogPost = blogPostService.getBlogPostById(id);
            
            // Increment view count
            blogPostService.incrementViewCount(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", blogPost
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching blog post: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch blog post: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/published")
    public ResponseEntity<Map<String, Object>> getAllPublishedPosts() {
        log.info("Received request to get all published blog posts");
        
        try {
            List<BlogPostDTO> posts = blogPostService.getAllPublishedPosts();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", posts
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching published posts: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch published posts: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/author/{authorId}")
    public ResponseEntity<Map<String, Object>> getPostsByAuthor(@PathVariable Long authorId) {
        log.info("Received request to get blog posts for author ID: {}", authorId);
        
        try {
            List<BlogPostDTO> posts = blogPostService.getPostsByAuthor(authorId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", posts
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching posts by author: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch posts by author: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/author/{authorId}/drafts")
    @PreAuthorize("hasAnyAuthority('ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> getDraftsByAuthor(@PathVariable Long authorId) {
        log.info("Received request to get drafts for author ID: {}", authorId);
        
        try {
            List<BlogPostDTO> drafts = blogPostService.getDraftsByAuthor(authorId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", drafts
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching drafts by author: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch drafts by author: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/author/{authorId}/latest-draft")
    @PreAuthorize("hasAnyAuthority('ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> getLatestDraftByAuthor(@PathVariable Long authorId) {
        log.info("Received request to get latest draft for author ID: {}", authorId);
        
        try {
            BlogPostDTO draft = blogPostService.getLatestDraftByAuthor(authorId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", draft != null ? draft : Map.of()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching latest draft: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch latest draft: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getPostsByCategory(@PathVariable String category) {
        log.info("Received request to get blog posts for category: {}", category);
        
        try {
            List<BlogPostDTO> posts = blogPostService.getPostsByCategory(category);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "data", posts
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching posts by category: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to fetch posts by category: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ALUMNI', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> deleteBlogPost(@PathVariable Long id) {
        log.info("Received request to delete blog post with ID: {}", id);
        
        try {
            blogPostService.deleteBlogPost(id);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Blog post deleted successfully"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting blog post: ", e);
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Failed to delete blog post: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
