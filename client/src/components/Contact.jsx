import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import '../styles/contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <section className="contact-section py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 mb-2">
            We'd Love to <span className="text-primary">Hear from You</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '800px', fontSize: '1.1rem' }}>
            Have questions, suggestions, or just want to connect? Reach out to our alumni support team.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          <Col lg={6}>
            <div className="contact-form-card p-4 bg-white rounded-4 shadow-sm">
              <h3 className="mb-4">Send Us a Message</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="John Doe"
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="john.doe@example.com"
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Your Message</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5}
                    placeholder="Your message here..."
                    className="form-control-lg"
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                >
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>

          <Col lg={5} className="ps-lg-4">
            <div className="contact-info-card p-4 bg-white rounded-4 shadow-sm mb-4">
              <h3 className="mb-4">Contact Information</h3>
              
              <div className="contact-info-item d-flex align-items-center mb-4">
                <div className="icon-wrapper">
                  <FaEnvelope className="text-primary" />
                </div>
                <div className="ms-3">
                  <h5 className="mb-1">Email Us</h5>
                  <a href="mailto:alumni@university.edu" className="text-primary text-decoration-none">
                    alumni@university.edu
                  </a>
                </div>
              </div>

              <div className="contact-info-item d-flex align-items-center mb-4">
                <div className="icon-wrapper">
                  <FaPhone className="text-primary" />
                </div>
                <div className="ms-3">
                  <h5 className="mb-1">Call Us</h5>
                  <a href="tel:+11234567890" className="text-primary text-decoration-none">
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>

              <div className="contact-info-item d-flex align-items-center">
                <div className="icon-wrapper">
                  <FaMapMarkerAlt className="text-primary" />
                </div>
                <div className="ms-3">
                  <h5 className="mb-1">Visit Us</h5>
                  <p className="text-muted mb-0">
                    Alumni Relations Office<br />
                    Main Campus, Building 5<br />
                    University City, ST 12345
                  </p>
                </div>
              </div>
            </div>

            <div className="social-card p-4 bg-white rounded-4 shadow-sm">
              <h3 className="mb-4">Connect With Us</h3>
              <p className="text-muted mb-4">
                Follow us on social media for the latest updates, events, and alumni stories.
              </p>
              <div className="social-links d-flex gap-3">
                <a href="#" className="social-link">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-link">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="social-link">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact; 