import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const NavigationBar = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const sections = ['hero', 'about', 'events', 'mentorship', 'faq', 'contact'];
        const offset = 100; // Offset for better trigger point

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const elementTop = element.offsetTop - offset;
            const elementBottom = elementTop + element.offsetHeight;
            const scrollPosition = window.scrollY + offset;

            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              setActiveSection(section);
              break;
            }
          }
        }
      }, 50); // Small delay to prevent flickering
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Navbar bg="white" expand="lg" className="py-3 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">AlumniConnect</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link 
              onClick={() => scrollToSection('hero')} 
              className={`mx-2 ${activeSection === 'hero' ? 'active' : ''}`}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollToSection('about')} 
              className={`mx-2 ${activeSection === 'about' ? 'active' : ''}`}
            >
              About
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollToSection('events')} 
              className={`mx-2 ${activeSection === 'events' ? 'active' : ''}`}
            >
              Events
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollToSection('mentorship')} 
              className={`mx-2 ${activeSection === 'mentorship' ? 'active' : ''}`}
            >
              Mentorship
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollToSection('faq')} 
              className={`mx-2 ${activeSection === 'faq' ? 'active' : ''}`}
            >
              FAQs
            </Nav.Link>
            <Nav.Link 
              onClick={() => scrollToSection('contact')} 
              className={`mx-2 ${activeSection === 'contact' ? 'active' : ''}`}
            >
              Contact
            </Nav.Link>
          </Nav>
          <div className="d-flex">
            <Button as={Link} to="/login" variant="outline-primary" className="me-2">Log in</Button>
            <Button as={Link} to="/signup" variant="primary">Sign up</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 