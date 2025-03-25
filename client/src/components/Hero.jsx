import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero-section py-5" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container className="text-center">
        <h1 className="display-3 fw-bold mb-4" style={{ color: '#2D3748' }}>
          Reconnect, Engage, and Grow<br />
          with Your Alumni Network
        </h1>
        <p className="lead text-muted mb-5" style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
          Join thousands of alumni creating meaningful connections, sharing
          opportunities, and building a stronger community together.
        </p>
        <Button 
          as={Link}
          to="/signup"
          variant="primary" 
          size="lg" 
          className="px-5 py-3"
          style={{ borderRadius: '30px', fontSize: '1.1rem' }}
        >
          Join Now
        </Button>
      </Container>
    </div>
  );
};

export default Hero; 