package com.server.server.service;

import com.server.server.dto.BlogPostDTO;
import com.server.server.dto.BlogPostRequest;
import com.server.server.model.BlogPost;
import com.server.server.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlogPostService {
    
    private final BlogPostRepository blogPostRepository;
    
    @Transactional
    public BlogPostDTO saveDraft(BlogPostRequest request) {
        log.info("Saving blog post draft: {}", request.getTitle());
        
        BlogPost blogPost = new BlogPost();
        updateBlogPostFromRequest(blogPost, request);
        blogPost.setStatus(BlogPost.BlogStatus.DRAFT);
        
        BlogPost savedPost = blogPostRepository.save(blogPost);
        log.info("Draft saved successfully with ID: {}", savedPost.getId());
        
        return BlogPostDTO.fromEntity(savedPost);
    }
    
    @Transactional
    public BlogPostDTO publishBlogPost(BlogPostRequest request) {
        log.info("Publishing blog post: {}", request.getTitle());
        
        BlogPost blogPost = new BlogPost();
        updateBlogPostFromRequest(blogPost, request);
        blogPost.setStatus(BlogPost.BlogStatus.PUBLISHED);
        blogPost.setPublishedAt(LocalDateTime.now());
        
        BlogPost savedPost = blogPostRepository.save(blogPost);
        log.info("Blog post published successfully with ID: {}", savedPost.getId());
        
        return BlogPostDTO.fromEntity(savedPost);
    }
    
    @Transactional
    public BlogPostDTO updateBlogPost(Long id, BlogPostRequest request) {
        log.info("Updating blog post with ID: {}", id);
        
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with ID: " + id));
        
        updateBlogPostFromRequest(blogPost, request);
        
        BlogPost updatedPost = blogPostRepository.save(blogPost);
        log.info("Blog post updated successfully");
        
        return BlogPostDTO.fromEntity(updatedPost);
    }
    
    @Transactional
    public BlogPostDTO publishDraft(Long id) {
        log.info("Publishing draft with ID: {}", id);
        
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with ID: " + id));
        
        if (blogPost.getStatus() != BlogPost.BlogStatus.DRAFT) {
            throw new RuntimeException("Only draft posts can be published");
        }
        
        blogPost.setStatus(BlogPost.BlogStatus.PUBLISHED);
        blogPost.setPublishedAt(LocalDateTime.now());
        
        BlogPost publishedPost = blogPostRepository.save(blogPost);
        log.info("Draft published successfully");
        
        return BlogPostDTO.fromEntity(publishedPost);
    }
    
    @Transactional(readOnly = true)
    public BlogPostDTO getBlogPostById(Long id) {
        log.info("Fetching blog post with ID: {}", id);
        
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with ID: " + id));
        
        return BlogPostDTO.fromEntity(blogPost);
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getAllPublishedPosts() {
        log.info("Fetching all published blog posts");
        
        return blogPostRepository.findByStatusOrderByCreatedAtDesc(BlogPost.BlogStatus.PUBLISHED)
                .stream()
                .map(BlogPostDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getPostsByAuthor(Long authorId) {
        log.info("Fetching blog posts for author ID: {}", authorId);
        
        return blogPostRepository.findByAuthorIdOrderByCreatedAtDesc(authorId)
                .stream()
                .map(BlogPostDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getDraftsByAuthor(Long authorId) {
        log.info("Fetching draft posts for author ID: {}", authorId);
        
        return blogPostRepository.findByAuthorIdAndStatusOrderByCreatedAtDesc(authorId, BlogPost.BlogStatus.DRAFT)
                .stream()
                .map(BlogPostDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public BlogPostDTO getLatestDraftByAuthor(Long authorId) {
        log.info("Fetching latest draft for author ID: {}", authorId);
        
        return blogPostRepository.findFirstByAuthorIdAndStatusOrderByUpdatedAtDesc(authorId, BlogPost.BlogStatus.DRAFT)
                .map(BlogPostDTO::fromEntity)
                .orElse(null);
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getPostsByCategory(String category) {
        log.info("Fetching blog posts for category: {}", category);
        
        return blogPostRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, BlogPost.BlogStatus.PUBLISHED)
                .stream()
                .map(BlogPostDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteBlogPost(Long id) {
        log.info("Deleting blog post with ID: {}", id);
        
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with ID: " + id));
        
        blogPostRepository.delete(blogPost);
        log.info("Blog post deleted successfully");
    }
    
    @Transactional
    public void incrementViewCount(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with ID: " + id));
        
        blogPost.setViewCount(blogPost.getViewCount() + 1);
        blogPostRepository.save(blogPost);
    }
    
    private void updateBlogPostFromRequest(BlogPost blogPost, BlogPostRequest request) {
        blogPost.setTitle(request.getTitle());
        blogPost.setContent(request.getContent());
        blogPost.setCategory(request.getCategory());
        blogPost.setTags(request.getTags());
        
        // Set author info with defaults for development if not provided
        blogPost.setAuthorId(request.getAuthorId() != null ? request.getAuthorId() : 1L);
        blogPost.setAuthorName(request.getAuthorName() != null && !request.getAuthorName().isEmpty() 
            ? request.getAuthorName() : "Anonymous User");
        
        // Handle featured image
        if (request.getFeaturedImage() != null && !request.getFeaturedImage().isEmpty()) {
            try {
                // Remove data URL prefix if present
                String base64Image = request.getFeaturedImage();
                if (base64Image.contains(",")) {
                    base64Image = base64Image.split(",")[1];
                }
                byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                blogPost.setFeaturedImage(imageBytes);
            } catch (Exception e) {
                log.error("Error decoding featured image: ", e);
                throw new RuntimeException("Invalid image format");
            }
        }
    }
}
