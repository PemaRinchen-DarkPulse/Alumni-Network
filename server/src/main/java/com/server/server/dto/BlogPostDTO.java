package com.server.server.dto;

import com.server.server.model.BlogPost;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostDTO {
    
    private Long id;
    private String title;
    private String content;
    private String category;
    private List<String> tags;
    private String featuredImageUrl;
    private Long authorId;
    private String authorName;
    private String status;
    private int viewCount;
    private int likeCount;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    
    public static BlogPostDTO fromEntity(BlogPost blogPost) {
        BlogPostDTO dto = new BlogPostDTO();
        dto.setId(blogPost.getId());
        dto.setTitle(blogPost.getTitle());
        dto.setContent(blogPost.getContent());
        dto.setCategory(blogPost.getCategory());
        dto.setTags(blogPost.getTags());
        dto.setAuthorId(blogPost.getAuthorId());
        dto.setAuthorName(blogPost.getAuthorName());
        dto.setStatus(blogPost.getStatus().name());
        dto.setViewCount(blogPost.getViewCount());
        dto.setLikeCount(blogPost.getLikeCount());
        dto.setCommentCount(blogPost.getCommentCount());
        dto.setCreatedAt(blogPost.getCreatedAt());
        dto.setUpdatedAt(blogPost.getUpdatedAt());
        dto.setPublishedAt(blogPost.getPublishedAt());
        
        // Convert image to base64 if exists
        if (blogPost.getFeaturedImage() != null && blogPost.getFeaturedImage().length > 0) {
            dto.setFeaturedImageUrl(Base64.getEncoder().encodeToString(blogPost.getFeaturedImage()));
        }
        
        return dto;
    }
}
