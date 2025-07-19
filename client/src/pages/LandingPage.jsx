import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';

// Icons
const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="5"></circle>
    <path d="M20 21a8 8 0 0 0-16 0"></path>
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const BookOpenIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const NetworkIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="5" r="3"></circle>
    <path d="M12 8v8"></path>
    <circle cx="18" cy="16" r="3"></circle>
    <circle cx="6" cy="16" r="3"></circle>
    <path d="M6 13v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const LandingPage = () => {
  // Navigation hook for programmatic navigation
  const navigate = useNavigate();
  
  // Refs for scroll animations
  const aboutRef = useRef(null);
  const eventsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  
  // Scroll to section function
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Navigation functions
  const handleSignIn = () => {
    navigate('/login');
  };
  
  const handleSignUp = () => {
    navigate('/signup');
  };

  // For navbar animation on scroll
  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(
    scrollY,
    [0, 100, 200],
    [1, 0.98, 0.95]
  );
  
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ opacity: navbarOpacity }}
      >
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xl font-bold">Alumni Network</div>
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Events', 'Testimonials', 'Contact'].map((item) => (
              <motion.button
                key={item}
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => {
                  if (item === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' });
                  else if (item === 'About') scrollToSection(aboutRef);
                  else if (item === 'Events') scrollToSection(eventsRef);
                  else if (item === 'Testimonials') scrollToSection(testimonialsRef);
                  else if (item === 'Contact') scrollToSection(contactRef);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={handleSignIn}>Sign In</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" onClick={handleSignUp}>Sign Up</Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>
      
      {/* Hero Section */}
      <section className="relative pt-24 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* Background image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Alumni Network"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60" />
          </div>
          
          {/* Animated elements - contained within viewport */}
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-60 left-0 w-72 h-72 rounded-full bg-secondary/30 blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, -60, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block bg-primary/20 text-primary font-medium rounded-full px-4 py-1 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Alumni Network 2025
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Connect With Your <span className="text-primary">Alumni Community</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Build meaningful relationships, discover opportunities, and grow your network with fellow alumni.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="px-8" onClick={() => scrollToSection(aboutRef)}>
                    Learn More
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" onClick={handleSignUp}>
                    Join Now
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative mx-auto">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"></div>
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <img 
                    src="https://images.pexels.com/photos/7709208/pexels-photo-7709208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Alumni Networking" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section ref={aboutRef} className="py-24 bg-muted/50">
        <AboutSection />
      </section>
      
      {/* CTA Section 1 */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Connect with Fellow Alumni?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join our network today and unlock exclusive access to events, mentorship opportunities, and more.</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" onClick={handleSignUp} className="px-8">Join Now</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Events Section */}
      <section ref={eventsRef} className="py-24">
        <EventsSection />
      </section>
      
      {/* CTA Section 2 */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Alumni News</h2>
              <p className="text-muted-foreground mb-6">Subscribe to our newsletter and never miss important updates, event invitations, and alumni success stories.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input placeholder="Enter your email" className="sm:max-w-xs" />
                <Button>Subscribe</Button>
              </div>
            </motion.div>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="w-full max-w-sm aspect-square rounded-full bg-primary/10 flex items-center justify-center">
                <EnvelopeIcon className="w-16 h-16 text-primary/60" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-24 bg-muted/50">
        <TestimonialsSection />
      </section>
      
      {/* Contact Section */}
      <section ref={contactRef} className="py-24">
        <ContactSection />
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

// About Section Component
const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    navigate('/signup');
  };
  
  return (
    <div className="container px-4 md:px-6">
      <motion.div
        ref={ref}
        className="grid gap-12 md:grid-cols-2 items-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ x: -50 }}
          animate={isInView ? { x: 0 } : { x: -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-6">About Our Alumni Network</h2>
          <p className="text-muted-foreground mb-4">
            Our alumni network is a vibrant community of graduates who stay connected, 
            support each other professionally, and foster lifelong relationships.
          </p>
          <p className="text-muted-foreground mb-6">
            We provide a platform for networking, mentorship, career opportunities, 
            and social events to help you maintain meaningful connections with fellow alumni.
          </p>
          <Button variant="outline" onClick={handleSignUp}>Join Our Community</Button>
        </motion.div>
        
        <motion.div
          className="bg-gradient-to-br from-primary/15 to-secondary/20 rounded-xl shadow-lg overflow-hidden border border-primary/10 relative"
          initial={{ x: 50 }}
          animate={isInView ? { x: 0 } : { x: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Abstract decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="p-8 relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Our Mission
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="w-1 bg-primary/20 rounded-full mr-4 self-stretch"></div>
                <p className="text-lg font-medium">
                  To create a thriving, supportive community that empowers alumni to connect, 
                  collaborate, and contribute to each other's success.
                </p>
              </div>
              
              <div className="flex">
                <div className="w-1 bg-secondary/30 rounded-full mr-4 self-stretch"></div>
                <p className="text-muted-foreground">
                  We are dedicated to fostering meaningful relationships between graduates across 
                  different years and disciplines, creating opportunities for personal and professional growth.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              <motion.div 
                className="flex flex-col items-center text-center p-4 bg-background/80 rounded-lg shadow-sm"
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold">Community</p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center text-center p-4 bg-background/80 rounded-lg shadow-sm"
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <NetworkIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold">Networking</p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center text-center p-4 bg-background/80 rounded-lg shadow-sm"
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <BookOpenIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold">Mentorship</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Events Section Component
const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
  
  const events = [
    { 
      id: 1, 
      title: "Annual Alumni Reunion", 
      date: "August 15, 2025", 
      location: "Main Campus", 
      description: "Join us for the reunion.",
      image: "https://images.pexels.com/photos/7648477/pexels-photo-7648477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    { 
      id: 2, 
      title: "Career Workshop Series", 
      date: "September 5, 2025", 
      location: "Virtual", 
      description: "A series of professional development workshops focused on career advancement. Expert speakers will provide insights.",
      image: "https://images.pexels.com/photos/6457517/pexels-photo-6457517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    { 
      id: 3, 
      title: "Industry Networking Mixer", 
      date: "October 12, 2025", 
      location: "Downtown Conference Center", 
      description: "Connect with alumni working in various industries in a casual networking environment. Meet leaders from tech, finance, healthcare, education, and many other sectors. Expand your professional connections",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  // Function to handle event registration
  const handleRegister = (eventId, eventTitle) => {
    // In a real app, this would connect to a registration system
    console.log(`Registered for event ${eventId}: ${eventTitle}`);
    // You could show a toast notification or open a registration modal here
    alert(`Thank you for registering for "${eventTitle}"! You'll receive a confirmation email shortly.`);
  };
  
  return (
    <div className="container px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Upcoming Events</h2>
        <p className="text-muted-foreground">
          Stay connected with the community through our regular events and gatherings.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" ref={ref}>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="h-[450px] overflow-hidden hover:shadow-lg transition-shadow flex flex-col p-0">
              <div className="h-40 overflow-hidden w-full">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">{event.date}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{event.location}</p>
                <div className="text-muted-foreground mb-6 h-[4.5em] overflow-hidden">
                  {/* Using line-clamp-3 which automatically adds a single ellipsis when needed */}
                  <p className="line-clamp-3">{event.description}</p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    Learn More
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleRegister(event.id, event.title)}
                  >
                    Register
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
  
  const testimonials = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      role: "Marketing Director, Class of 2015", 
      content: "The alumni network has been invaluable for my career. I've met mentors and collaborators who have helped me grow professionally." 
    },
    { 
      id: 2, 
      name: "David Chen", 
      role: "Software Engineer, Class of 2018", 
      content: "Through the alumni events, I found job opportunities and connections that led to my current position. The community is supportive and engaging." 
    },
    { 
      id: 3, 
      name: "Maria Rodriguez", 
      role: "Healthcare Administrator, Class of 2010", 
      content: "Being part of this network has allowed me to give back by mentoring recent graduates while also expanding my professional circle." 
    }
  ];
  
  return (
    <div className="container px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Alumni Say</h2>
        <p className="text-muted-foreground">
          Hear from members who have benefited from our thriving alumni community.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3" ref={ref}>
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="mb-4 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 inline-block" />
                  ))}
                </div>
                <p className="mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Contact Section Component
const ContactSection = () => {
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const isFormInView = useInView(formRef, { amount: 0.3 });
  const isMapInView = useInView(mapRef, { amount: 0.3 });
  
  return (
    <div className="container px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Get In Touch</h2>
        <p className="text-muted-foreground">
          Have questions or want to learn more about our alumni community? Contact us!
        </p>
      </div>
      
      <div className="grid gap-12 md:grid-cols-2">
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, x: -30 }}
          animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <Input id="email" placeholder="your.email@example.com" type="email" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
            <Textarea id="message" placeholder="Your message..." className="min-h-32" />
          </div>
          <Button className="w-full">Send Message</Button>
        </motion.div>
        
        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, x: 30 }}
          animate={isMapInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.7 }}
          className="aspect-video rounded-xl overflow-hidden bg-muted shadow-md"
        >
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium">123 Alumni Way, Education City</p>
              <p className="text-sm text-muted-foreground">Campus Location</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-bold text-lg mb-3">Alumni Network</div>
            <p className="text-muted-foreground">
              Connecting graduates, building relationships,
              and fostering professional growth.
            </p>
          </div>
          
          <div>
            <div className="font-semibold mb-3">Quick Links</div>
            <div className="grid gap-2">
              {['Home', 'About', 'Events', 'Testimonials', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-3">Follow Us</div>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((platform) => (
                <a 
                  key={platform} 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Alumni Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default LandingPage;