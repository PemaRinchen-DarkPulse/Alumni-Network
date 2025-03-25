import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserFriends, FaComments, FaCalendarAlt, FaLayerGroup, FaUserGraduate } from 'react-icons/fa';
import { BsChatDots } from 'react-icons/bs';

const Features = () => {
  const features = [
    {
      icon: <FaUserFriends size={30} />,
      title: 'Alumni Directory',
      description: 'Search and connect with fellow alumni based on graduation year, field of study, industry, location, and more.'
    },
    {
      icon: <BsChatDots size={30} />,
      title: 'Messaging Platform',
      description: 'Communicate directly with other alumni through our secure messaging system, making networking effortless.'
    },
    {
      icon: <FaCalendarAlt size={30} />,
      title: 'Event Management',
      description: 'Discover, RSVP, and attend both virtual and in-person alumni events. Get reminders and add to your calendar.'
    },
    {
      icon: <FaLayerGroup size={30} />,
      title: 'Discussion Forums',
      description: 'Participate in topic-based discussions, share insights, and seek advice from your alumni community.'
    },
    {
      icon: <FaUserGraduate size={30} />,
      title: 'Mentorship Program',
      description: 'Connect with mentors or become one yourself. Our structured program facilitates meaningful mentoring relationships.'
    }
  ];

  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-5">
          <span className="text-primary fw-semibold">Features We Provide</span>
          <h2 className="display-5 mt-2 mb-3">
            Everything You Need to <span className="text-primary">Stay Connected</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '800px', fontSize: '1.1rem' }}>
            Our platform is packed with features designed to enhance your alumni experience,
            making it easier than ever to connect, engage, and grow with your network.
          </p>
        </div>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col lg={index < 3 ? 4 : 6} key={index}>
              <Card className="border-0 shadow-sm h-100 p-4">
                <div className="d-flex flex-column h-100">
                  <div className="icon-wrapper text-primary mb-3 d-flex align-items-center justify-content-center" 
                       style={{ 
                         width: '48px', 
                         height: '48px', 
                         borderRadius: '12px',
                         backgroundColor: '#e6f3ff' 
                       }}>
                    {feature.icon}
                  </div>
                  <h4 className="mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features; 