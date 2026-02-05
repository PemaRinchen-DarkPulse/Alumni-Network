package com.server.server.config;

import com.server.server.model.BlogPost;
import com.server.server.repository.BlogPostRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class BlogDataInitializer {

    @Bean
    CommandLineRunner initBlogData(BlogPostRepository blogPostRepository) {
        return args -> {
            // Only initialize if there are no blog posts
            if (blogPostRepository.count() == 0) {
                
                BlogPost post1 = new BlogPost();
                post1.setTitle("My Journey from College to Tech: Lessons Learned");
                post1.setContent("Transitioning from college to the tech industry was one of the most challenging yet rewarding experiences of my life. In this post, I'll share the key lessons I learned along the way, from dealing with imposter syndrome to building a strong professional network. The first year was particularly difficult as I navigated new technologies and corporate culture, but with persistence and the support of my alumni network, I managed to thrive. Here are the top 5 lessons that helped me succeed: 1. Never stop learning - The tech industry moves fast, and continuous learning is essential. 2. Build relationships - Your network is your net worth. 3. Don't be afraid to ask questions - No question is too small. 4. Embrace failure - Every mistake is a learning opportunity. 5. Find mentors - Having experienced professionals guide you is invaluable.");
                post1.setCategory("CAREER ADVICE");
                post1.setTags(Arrays.asList("career", "technology", "beginners"));
                post1.setAuthorId(1L);
                post1.setAuthorName("Sarah Johnson");
                post1.setStatus(BlogPost.BlogStatus.PUBLISHED);
                post1.setViewCount(245);
                post1.setLikeCount(32);
                post1.setCommentCount(8);
                post1.setPublishedAt(LocalDateTime.of(2026, 1, 15, 10, 30));
                
                BlogPost post2 = new BlogPost();
                post2.setTitle("The Future of AI in Healthcare");
                post2.setContent("Artificial Intelligence is revolutionizing healthcare in unprecedented ways. From diagnostic tools to personalized treatment plans, AI is transforming how we approach medicine. As someone working at the intersection of technology and healthcare, I've witnessed firsthand the incredible potential of AI-powered solutions. Machine learning algorithms can now detect diseases earlier and more accurately than ever before. Computer vision helps radiologists identify anomalies in medical imaging. Natural language processing assists in analyzing patient records and extracting valuable insights. The future is incredibly promising, but we must also address challenges around data privacy, algorithmic bias, and the need for human oversight in critical medical decisions.");
                post2.setCategory("TECHNOLOGY");
                post2.setTags(Arrays.asList("AI", "healthcare", "innovation"));
                post2.setAuthorId(2L);
                post2.setAuthorName("Dr. Michael Chen");
                post2.setStatus(BlogPost.BlogStatus.PUBLISHED);
                post2.setViewCount(532);
                post2.setLikeCount(78);
                post2.setCommentCount(15);
                post2.setPublishedAt(LocalDateTime.of(2026, 1, 20, 14, 15));
                
                BlogPost post3 = new BlogPost();
                post3.setTitle("Building a Strong Professional Network");
                post3.setContent("Networking is not just about collecting business cards or LinkedIn connections. It's about building genuine relationships that can last a lifetime. In this comprehensive guide, I'll share strategies that have helped me build a robust professional network across various industries. The key is authenticity - people can tell when you're being genuine versus when you're just trying to get something from them. Start by identifying people you genuinely admire and whose work resonates with you. Reach out with specific questions or comments about their work. Offer value before asking for anything in return. Attend industry events and conferences, but focus on quality conversations rather than quantity. Follow up consistently and maintain relationships over time. Remember, your alumni network is one of your most valuable resources - leverage it wisely.");
                post3.setCategory("NETWORKING TIPS");
                post3.setTags(Arrays.asList("networking", "career", "professional-development"));
                post3.setAuthorId(3L);
                post3.setAuthorName("Emily Williams");
                post3.setStatus(BlogPost.BlogStatus.PUBLISHED);
                post3.setViewCount(387);
                post3.setLikeCount(54);
                post3.setCommentCount(12);
                post3.setPublishedAt(LocalDateTime.of(2026, 1, 25, 9, 0));

                BlogPost post4 = new BlogPost();
                post4.setTitle("Mastering Remote Work: Tips for Success");
                post4.setContent("Remote work has become the new norm for many professionals, but it comes with its own set of challenges. After three years of working remotely, I've learned valuable lessons about productivity, work-life balance, and maintaining connections with colleagues. Creating a dedicated workspace is crucial - even if it's just a corner of your room. Establish clear boundaries between work and personal time. Use video calls strategically to maintain face-to-face connections. Invest in good equipment - a quality microphone and camera make a huge difference. Stay disciplined with your schedule but also allow for flexibility. Don't forget to take breaks and move around regularly. Most importantly, overcommunicate with your team to avoid misunderstandings and stay aligned on goals.");
                post4.setCategory("CAREER ADVICE");
                post4.setTags(Arrays.asList("remote-work", "productivity", "work-life-balance"));
                post4.setAuthorId(4L);
                post4.setAuthorName("James Rodriguez");
                post4.setStatus(BlogPost.BlogStatus.PUBLISHED);
                post4.setViewCount(421);
                post4.setLikeCount(65);
                post4.setCommentCount(18);
                post4.setPublishedAt(LocalDateTime.of(2026, 1, 28, 11, 45));

                BlogPost post5 = new BlogPost();
                post5.setTitle("From Student to Startup Founder: My Story");
                post5.setContent("Four years ago, I was a college student with a dream and no idea how to make it happen. Today, I'm the founder of a successful tech startup with 20 employees. This journey has been filled with ups and downs, successes and failures, late nights and early mornings. Starting a business while still in school was incredibly challenging, but it taught me more than any classroom ever could. I learned about product development, fundraising, hiring, and scaling. I made countless mistakes along the way - from poor hiring decisions to mismanaging cash flow. But each failure taught me valuable lessons. The support from my alumni network was instrumental - from mentorship to initial funding to customer introductions. If you're considering entrepreneurship, my advice is simple: start now, fail fast, learn quickly, and never give up on your vision.");
                post5.setCategory("ENTREPRENEURSHIP");
                post5.setTags(Arrays.asList("startup", "entrepreneurship", "business"));
                post5.setAuthorId(5L);
                post5.setAuthorName("Alex Kim");
                post5.setStatus(BlogPost.BlogStatus.PUBLISHED);
                post5.setViewCount(612);
                post5.setLikeCount(89);
                post5.setCommentCount(24);
                post5.setPublishedAt(LocalDateTime.of(2026, 2, 1, 8, 30));

                BlogPost post6 = new BlogPost();
                post6.setTitle("The Importance of Continuous Learning in Tech");
                post6.setContent("In the fast-paced world of technology, standing still means falling behind. Continuous learning isn't just a nice-to-have - it's essential for career survival and growth. But with so much to learn and so little time, how do you prioritize? I've developed a framework that has helped me stay current while avoiding burnout. First, identify your core competencies and stay updated on those fundamentals. Second, dedicate time each week to exploring emerging technologies. Third, learn through doing - build projects that incorporate new skills. Fourth, join communities where you can learn from others and share your knowledge. Online courses, technical blogs, podcasts, and conferences are all valuable resources. Remember, learning is a marathon, not a sprint. Consistency beats intensity every time.");
                post6.setCategory("EDUCATION");
                post6.setTags(Arrays.asList("learning", "technology", "professional-development"));
                post6.setAuthorId(6L);
                post6.setAuthorName("Lisa Thompson");
                post6.setStatus(BlogPost.BlogStatus.PUBLISHED);
                post6.setViewCount(298);
                post6.setLikeCount(42);
                post6.setCommentCount(9);
                post6.setPublishedAt(LocalDateTime.of(2026, 2, 3, 13, 20));

                List<BlogPost> posts = Arrays.asList(post1, post2, post3, post4, post5, post6);
                blogPostRepository.saveAll(posts);
                
                System.out.println("Blog data initialized successfully with " + posts.size() + " posts!");
            }
        };
    }
}
