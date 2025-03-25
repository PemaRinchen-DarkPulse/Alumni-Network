import React, { useState } from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/faq.css';

const FAQ = () => {
  const [activeKey, setActiveKey] = useState(null);

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Creating an account is simple! Click the "Sign Up" button in the top right corner, fill in your basic information including your graduation year and field of study, verify your alumni status, and you\'re ready to connect!'
    },
    {
      question: 'Is membership free?',
      answer: 'Yes, membership to the alumni network is completely free for all verified graduates. We believe in making connections and opportunities accessible to all alumni.'
    },
    {
      question: 'How can I update my information?',
      answer: 'Log in to your account, navigate to your profile settings, and you can update your personal information, professional details, privacy settings, and communication preferences at any time.'
    },
    {
      question: 'Can I control who sees my profile information?',
      answer: 'Absolutely! We provide detailed privacy settings that let you control what information is visible to other alumni, mentors, or the public. You can adjust these settings anytime in your profile.'
    },
    {
      question: 'How do I find alumni in my area or industry?',
      answer: 'Use our advanced search filters in the Alumni Directory to find connections based on location, industry, graduation year, or field of study. You can also join industry-specific groups and local chapters.'
    },
    {
      question: 'What should I do if I forgot my password?',
      answer: 'Click the "Forgot Password" link on the login page. Enter your registered email address, and we\'ll send you instructions to reset your password securely.'
    }
  ];

  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-4">
          <h2 className="display-5 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '800px', fontSize: '1.1rem' }}>
            Find answers to common questions about our alumni network.
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Accordion 
              activeKey={activeKey} 
              onSelect={(key) => setActiveKey(key)}
              className="faq-accordion"
            >
              {faqs.map((faq, index) => (
                <Accordion.Item 
                  key={index} 
                  eventKey={index.toString()}
                  className="mb-2 border rounded-3 overflow-hidden"
                >
                  <Accordion.Header>
                    <span className="fw-medium">{faq.question}</span>
                    <FaChevronDown 
                      className={`ms-auto transition-transform ${
                        activeKey === index.toString() ? 'rotate-180' : ''
                      }`}
                    />
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted mb-0">{faq.answer}</p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FAQ; 