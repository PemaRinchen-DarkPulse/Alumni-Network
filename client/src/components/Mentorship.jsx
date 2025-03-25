import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaGraduationCap, FaBriefcase, FaUsers } from 'react-icons/fa';

const Mentorship = () => {
  const features = [
    {
      icon: <FaGraduationCap size={24} className="text-primary" />,
      title: 'Personalized Guidance',
      description: 'One-on-one mentorship tailored to your goals'
    },
    {
      icon: <FaBriefcase size={24} className="text-primary" />,
      title: 'Career Resources',
      description: 'Resume reviews, interview prep, and job search strategies'
    },
    {
      icon: <FaUsers size={24} className="text-primary" />,
      title: 'Industry Connections',
      description: 'Access to professional networks in your field'
    }
  ];

  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 mb-3">
            Mentorship & Career Support
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '800px', fontSize: '1.1rem' }}>
            Connect with experienced professionals and access resources to advance your career.
          </p>
        </div>

        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h3 className="mb-4">Find Your Mentor</h3>
            <p className="text-muted mb-4">
              Our mentorship program pairs recent graduates and alumni in career transitions with
              experienced professionals in their desired fields. Mentors provide guidance, share industry
              insights, and help mentees navigate their professional journeys.
            </p>
            
            {features.map((feature, index) => (
              <div key={index} className="d-flex align-items-start mb-4">
                <div className="me-3 p-3 rounded-3" style={{ backgroundColor: '#e6f3ff' }}>
                  {feature.icon}
                </div>
                <div>
                  <h5 className="mb-1">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 d-flex gap-3">
              <Button variant="primary" className="px-4">
                Find a Mentor
              </Button>
              <Button variant="outline-primary" className="px-4">
                Become a Mentor
              </Button>
            </div>
          </Col>
          <Col lg={6}>
            <div className="position-relative">
              <img
                src="/mentorship-image.jpg"
                alt="Mentorship session"
                className="img-fluid rounded-4 shadow"
                style={{ 
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover'
                }}
              />
              <div 
                className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Mentorship; 