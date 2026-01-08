package com.server.server.config;

import com.server.server.model.Event;
import com.server.server.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    
    private final EventRepository eventRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (eventRepository.count() == 0) {
            log.info("Seeding database with initial event data...");
            
            // Past Featured Event
            Event pastFeaturedEvent = new Event();
            pastFeaturedEvent.setTitle("Annual Alumni Gala 2025");
            pastFeaturedEvent.setDescription("Join us for an elegant evening of networking, celebration, and reconnecting with fellow alumni. Enjoy dinner, live entertainment, and inspiring keynote speeches from distinguished guests.");
            pastFeaturedEvent.setStartDateTime(LocalDateTime.of(2025, 12, 15, 18, 0));
            pastFeaturedEvent.setEndDateTime(LocalDateTime.of(2025, 12, 15, 22, 0));
            pastFeaturedEvent.setLocation("Grand Ballroom, Downtown Convention Center");
            pastFeaturedEvent.setIsVirtual(false);
            pastFeaturedEvent.setIsFeatured(true);
            pastFeaturedEvent.setVisibility(Event.Visibility.PUBLIC);
            pastFeaturedEvent.setMaxAttendees(200);
            pastFeaturedEvent.setCreatedBy(1L);
            pastFeaturedEvent.setStatus(Event.EventStatus.PUBLISHED);
            eventRepository.save(pastFeaturedEvent);
            log.info("Created past featured event: {}", pastFeaturedEvent.getTitle());
            
            // Upcoming Featured Event
            Event upcomingFeaturedEvent = new Event();
            upcomingFeaturedEvent.setTitle("Spring Alumni Networking Gala 2026");
            upcomingFeaturedEvent.setDescription("Join us for an elegant evening of networking, celebration, and reconnecting with fellow alumni. Enjoy dinner, live entertainment, and inspiring keynote speeches. This is the premier networking event of the year!");
            upcomingFeaturedEvent.setStartDateTime(LocalDateTime.of(2026, 3, 15, 18, 0));
            upcomingFeaturedEvent.setEndDateTime(LocalDateTime.of(2026, 3, 15, 22, 0));
            upcomingFeaturedEvent.setLocation("Grand Ballroom, Downtown Convention Center");
            upcomingFeaturedEvent.setIsVirtual(false);
            upcomingFeaturedEvent.setIsFeatured(true);
            upcomingFeaturedEvent.setVisibility(Event.Visibility.PUBLIC);
            upcomingFeaturedEvent.setMaxAttendees(200);
            upcomingFeaturedEvent.setCreatedBy(1L);
            upcomingFeaturedEvent.setStatus(Event.EventStatus.PUBLISHED);
            eventRepository.save(upcomingFeaturedEvent);
            log.info("Created upcoming featured event: {}", upcomingFeaturedEvent.getTitle());
            
            // Additional Non-Featured Upcoming Events
            Event aiWorkshop = new Event();
            aiWorkshop.setTitle("AI & Machine Learning Workshop");
            aiWorkshop.setDescription("Hands-on workshop covering the latest trends in artificial intelligence and machine learning. Perfect for professionals looking to upskill.");
            aiWorkshop.setStartDateTime(LocalDateTime.of(2026, 2, 14, 9, 0));
            aiWorkshop.setEndDateTime(LocalDateTime.of(2026, 2, 14, 17, 0));
            aiWorkshop.setLocation("Tech Innovation Hub, Building A");
            aiWorkshop.setIsVirtual(false);
            aiWorkshop.setIsFeatured(false);
            aiWorkshop.setVisibility(Event.Visibility.PUBLIC);
            aiWorkshop.setMaxAttendees(50);
            aiWorkshop.setCreatedBy(1L);
            aiWorkshop.setStatus(Event.EventStatus.PUBLISHED);
            eventRepository.save(aiWorkshop);
            log.info("Created non-featured event: {}", aiWorkshop.getTitle());
            
            Event careerFair = new Event();
            careerFair.setTitle("Career Fair 2026");
            careerFair.setDescription("Connect with top employers and explore exciting career opportunities. Bring your resume and dress professionally!");
            careerFair.setStartDateTime(LocalDateTime.of(2026, 1, 25, 10, 0));
            careerFair.setEndDateTime(LocalDateTime.of(2026, 1, 25, 16, 0));
            careerFair.setLocation("University Sports Complex");
            careerFair.setIsVirtual(false);
            careerFair.setIsFeatured(false);
            careerFair.setVisibility(Event.Visibility.PUBLIC);
            careerFair.setMaxAttendees(300);
            careerFair.setCreatedBy(1L);
            careerFair.setStatus(Event.EventStatus.PUBLISHED);
            eventRepository.save(careerFair);
            log.info("Created non-featured event: {}", careerFair.getTitle());
            
            Event startupPitch = new Event();
            startupPitch.setTitle("Startup Pitch Competition");
            startupPitch.setDescription("Watch alumni entrepreneurs pitch their innovative startups to a panel of investors. Network with founders and VCs.");
            startupPitch.setStartDateTime(LocalDateTime.of(2026, 4, 20, 14, 0));
            startupPitch.setEndDateTime(LocalDateTime.of(2026, 4, 20, 18, 0));
            startupPitch.setLocation("Innovation Lab, Main Campus");
            startupPitch.setIsVirtual(false);
            startupPitch.setIsFeatured(false);
            startupPitch.setVisibility(Event.Visibility.PUBLIC);
            startupPitch.setMaxAttendees(120);
            startupPitch.setCreatedBy(1L);
            startupPitch.setStatus(Event.EventStatus.PUBLISHED);
            eventRepository.save(startupPitch);
            log.info("Created non-featured event: {}", startupPitch.getTitle());
            
            // Additional Past Events
            Event pastWorkshop = new Event();
            pastWorkshop.setTitle("Intro to Data Science Workshop");
            pastWorkshop.setDescription("A comprehensive workshop for beginners to learn the fundamentals of Data Science and Data Analytics.");
            pastWorkshop.setStartDateTime(LocalDateTime.of(2025, 11, 5, 19, 30));
            pastWorkshop.setEndDateTime(LocalDateTime.of(2025, 11, 5, 21, 30));
            pastWorkshop.setLocation("Coffee Ground Conference Room");
            pastWorkshop.setIsVirtual(false);
            pastWorkshop.setIsFeatured(false);
            pastWorkshop.setVisibility(Event.Visibility.PUBLIC);
            pastWorkshop.setMaxAttendees(60);
            pastWorkshop.setCreatedBy(1L);
            pastWorkshop.setStatus(Event.EventStatus.PUBLISHED);
            eventRepository.save(pastWorkshop);
            log.info("Created past event: {}", pastWorkshop.getTitle());
            
            Event classReunion = new Event();
            classReunion.setTitle("Class of 2014 Reunion");
            classReunion.setDescription("It's been 12 years since our class graduated! Let's come together to reconnect, reminisce, and celebrate our journey.");
            classReunion.setStartDateTime(LocalDateTime.of(2025, 12, 12, 19, 0));
            classReunion.setEndDateTime(LocalDateTime.of(2025, 12, 12, 23, 0));
            classReunion.setLocation("Alumni Center");
            classReunion.setIsVirtual(false);
            classReunion.setIsFeatured(false);
            classReunion.setVisibility(Event.Visibility.PUBLIC);
            classReunion.setMaxAttendees(150);
            classReunion.setCreatedBy(1L);
            classReunion.setStatus(Event.EventStatus.PUBLISHED);
            eventRepository.save(classReunion);
            log.info("Created past event: {}", classReunion.getTitle());
            
            log.info("Database seeding completed successfully!");
        } else {
            log.info("Database already contains data. Skipping seeding.");
        }
    }
}
