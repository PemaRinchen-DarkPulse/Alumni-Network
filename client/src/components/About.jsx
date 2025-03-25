import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserFriends, FaGraduationCap, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';

const About = () => {
  const features = [
    { icon: <FaUserFriends size={30} />, title: 'Networking' },
    { icon: <FaGraduationCap size={30} />, title: 'Mentorship' },
    { icon: <FaCalendarAlt size={30} />, title: 'Events' },
    { icon: <FaBriefcase size={30} />, title: 'Career Support' }
  ];

  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="text-center display-4 mb-3">About Our Alumni Network</h2>
        <p className="text-center text-muted mb-5" style={{ fontSize: '1.1rem' }}>
          A platform designed to foster lifelong connections and support the continued growth and success of our alumni community.
        </p>
        
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h3 className="mb-4">Our Mission</h3>
            <p className="text-muted">
              We believe that the relationships formed during your time at the university should last a lifetime. 
              Our alumni network is built on the foundation of maintaining these connections and providing meaningful 
              opportunities for engagement, professional development, and giving back.
            </p>
            <Row className="g-4 mt-2">
              {features.map((feature, index) => (
                <Col xs={6} key={index}>
                  <Card className="border-0 bg-white text-center p-4 h-100">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="icon-wrapper text-primary mb-3">
                        {feature.icon}
                      </div>
                      <h5 className="mb-0">{feature.title}</h5>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={6}>
            <img 
              src="/about-image.jpg" 
              alt="Students collaborating" 
              className="img-fluid rounded-4 shadow"
              style={{ objectFit: 'cover', height: '400px', width: '100%' }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About; 