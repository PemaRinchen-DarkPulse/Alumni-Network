import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import '../styles/footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <Container>
        <Row className="py-5">
          {/* Alumni Connect Column */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-white mb-4">Alumni Connect</h5>
            <p className="text-muted mb-4">
              Building bridges between generations of alumni, fostering connections, and creating
              opportunities for continued growth and engagement.
            </p>
            <button 
              onClick={scrollToTop} 
              className="back-to-top text-primary d-flex align-items-center border-0 bg-transparent p-0"
            >
              Back to Top <FaArrowUp className="ms-2" />
            </button>
          </Col>

          {/* Quick Links Column */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-white mb-4">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/mentorship">Mentorship</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </Col>

          {/* Resources Column */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-white mb-4">Resources</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/career">Career Resources</Link></li>
              <li><Link to="/magazine">Alumni Magazine</Link></li>
              <li><Link to="/education">Continuing Education</Link></li>
              <li><Link to="/volunteer">Volunteer Opportunities</Link></li>
              <li><Link to="/benefits">Alumni Benefits</Link></li>
            </ul>
          </Col>

          {/* Legal Column */}
          <Col lg={3} md={6}>
            <h5 className="text-white mb-4">Legal</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookie">Cookie Policy</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/copyright">Copyright Notice</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Bottom Bar */}
      <div className="footer-bottom py-3 border-top border-secondary">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
              <p className="mb-0 text-muted">© 2025 Alumni Connect. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="footer-bottom-links">
                <Link to="/preferences">Email Preferences</Link>
                <span className="mx-2 text-muted">|</span>
                <Link to="/support">Support</Link>
                <span className="mx-2 text-muted">|</span>
                <Link to="https://university.edu">University Website</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 