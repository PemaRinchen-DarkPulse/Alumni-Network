import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers, FaCheck, FaArrowRight } from 'react-icons/fa';

const Events = () => {
  const upcomingEvents = [
    {
      type: 'Reunion',
      image: '/event-reunion.jpg',
      title: 'Annual Alumni Reunion',
      date: 'June 15, 2024',
      time: '6:00 PM - 10:00 PM',
      location: 'University Main Campus',
      attending: '240 attending'
    },
    {
      type: 'Workshop',
      image: '/event-workshop.jpg',
      title: 'Career Development Workshop',
      date: 'May 20, 2024',
      time: '2:00 PM - 4:30 PM',
      location: 'Virtual (Zoom)',
      attending: '120 attending'
    },
    {
      type: 'Networking',
      image: '/event-networking.jpg',
      title: 'Networking Mixer: Tech Industry',
      date: 'July 8, 2024',
      time: '7:00 PM - 9:00 PM',
      location: 'Downtown Tech Hub',
      attending: '85 attending'
    }
  ];

  const eventSupport = [
    'Platform for event registration',
    'Promotion to relevant alumni',
    'Attendance tracking',
    'Event planning guidance'
  ];

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <span className="text-primary fw-semibold px-3 py-1 bg-primary bg-opacity-10 rounded-pill">
            Upcoming Events
          </span>
          <h2 className="display-5 mt-3 mb-3">
            Join Us for Exciting <span className="text-primary">Alumni Events</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '800px', fontSize: '1.1rem' }}>
            Stay connected with fellow alumni through our diverse range of events,
            from reunions and workshops to networking sessions and guest lectures.
          </p>
        </div>

        <Row className="g-4 mb-4">
          {upcomingEvents.map((event, index) => (
            <Col md={4} key={index}>
              <Card className="border-0 shadow-sm h-100">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={event.image} 
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <span className="position-absolute top-0 start-0 m-3 badge bg-white text-primary">
                    {event.type}
                  </span>
                </div>
                <Card.Body>
                  <h4 className="mb-3">{event.title}</h4>
                  <div className="text-muted mb-2">
                    <FaCalendar className="me-2" />{event.date}
                  </div>
                  <div className="text-muted mb-2">
                    <FaClock className="me-2" />{event.time}
                  </div>
                  <div className="text-muted mb-2">
                    <FaMapMarkerAlt className="me-2" />{event.location}
                  </div>
                  <div className="text-muted mb-3">
                    <FaUsers className="me-2" />{event.attending}
                  </div>
                  <Button variant="primary" className="w-100">RSVP Now</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mb-5">
          <Button 
            variant="outline-primary" 
            size="lg" 
            className="px-5 py-3 d-inline-flex align-items-center gap-2 rounded-pill hover-shadow-lg transition"
            style={{ 
              transition: 'all 0.3s ease',
              borderWidth: '2px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            See All Events <FaArrowRight />
          </Button>
        </div>

        <Row className="align-items-center bg-white p-4 rounded-4 shadow-sm">
          <Col md={7}>
            <span className="text-primary fw-semibold">Host Your Own Event</span>
            <h3 className="mt-2 mb-3">Have an idea for an alumni gathering?</h3>
            <p className="text-muted mb-4">
              We support alumni-initiated events! Whether it's a class reunion, industry mixer, 
              or special interest gathering, we can help you plan, promote, and host your event 
              on our platform.
            </p>
            <Button variant="primary">Propose an Event</Button>
          </Col>
          <Col md={5}>
            <Card className="border-0 bg-light">
              <Card.Body>
                <h5 className="mb-4">Event Support Includes:</h5>
                {eventSupport.map((support, index) => (
                  <div key={index} className="d-flex align-items-center mb-3">
                    <div className="text-primary me-3">
                      <FaCheck />
                    </div>
                    <div>{support}</div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Events; 