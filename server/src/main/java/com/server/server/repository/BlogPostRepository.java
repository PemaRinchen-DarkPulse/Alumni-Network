package com.server.server.repository;

import com.server.server.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    List<BlogPost> findByStatusOrderByCreatedAtDesc(BlogPost.BlogStatus status);
    
    List<BlogPost> findByAuthorIdAndStatusOrderByCreatedAtDesc(Long authorId, BlogPost.BlogStatus status);
    
    List<BlogPost> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    List<BlogPost> findByCategoryAndStatusOrderByCreatedAtDesc(String category, BlogPost.BlogStatus status);
    
    Optional<BlogPost> findFirstByAuthorIdAndStatusOrderByUpdatedAtDesc(Long authorId, BlogPost.BlogStatus status);
}
