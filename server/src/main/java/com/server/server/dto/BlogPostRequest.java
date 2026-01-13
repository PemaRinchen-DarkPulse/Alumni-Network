package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostRequest {
    
    private String title;
    private String content;
    private String category;
    private List<String> tags;
    private String featuredImage; // Base64 encoded image
    private Long authorId;
    private String authorName;
}
