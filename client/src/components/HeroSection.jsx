import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './HeroSection.css'; // Import the CSS file

const HeroSection = () => {
  return (
    <div className="hero-container">
      <Container className="text-center">
        <h1 className="hero-title">Reconnect, Engage, and Grow with Your Alumni Network</h1>
        <p className="hero-subtitle">
          Join thousands of alumni creating meaningful connections, sharing opportunities, and building a stronger community together.
        </p>
        <Button variant="primary" size="lg" className="hero-button">Join Now</Button>
        <div className="down-arrow">
          <a href="#content" aria-label="Scroll to content">
            <i className="fas fa-chevron-down fa-2x"></i>
          </a>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
