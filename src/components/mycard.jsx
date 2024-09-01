import React from "react";
import { Card, CardTitle, CardText, Button, Row, Col } from "reactstrap";
import "./style.css";
export const MyCard = () => {
  return (
    <Row className="container-fluid">
      <h1 className="text-center color-primary">Upcoming Events</h1>
      <Col sm="4">
        <Card body>
          <CardTitle tag="h5" className="fw-bold">Web Development Workshop</CardTitle>
          <CardText>
            <span>Date: September 15, 2024</span><br/>
            <span>Location: Online</span>
          </CardText>
          <Button color="link" style={{ textAlign: 'left', display: 'block', paddingLeft: 0 }}>Learn More</Button>
        </Card>
      </Col>
      <Col sm="4">
        <Card body>
          <CardTitle tag="h5" className="fw-bold">Annual Alumni Gala</CardTitle>
          <CardText>
            <span>Date: November 20, 2024</span> <br/>
            <span>Location: University Campus</span>
          </CardText>
          <Button color="link" style={{ textAlign: 'left', display: 'block', paddingLeft: 0 }}>Learn More</Button>
        </Card>
      </Col>
      <Col sm="4">
        <Card body>
          <CardTitle tag="h5" className="fw-bold">Networking Night</CardTitle>
          <CardText>
            <span>Date: December 10, 2024</span><br/>
            <span>Location: City Center</span>
          </CardText>
          <Button color="link" style={{ textAlign: 'left', display: 'block', paddingLeft: 0 }}>Learn More</Button>
        </Card>
      </Col>
    </Row>
  );
}

export const MySecondCard=()=>{
    return (
        <Row>
        <h1 className="text-center">What Our Alumni Say</h1>
      <Col sm="4">
        <Card body>
          <CardText>
            <b>"The Alumni Network has been a great resource for reconnecting with old classmates and expanding my professional network."</b><br/>
            <p>- John Doe, Class of 2020</p>
            <span>Read More</span>
          </CardText>
        </Card>
      </Col>
      <Col sm="4">
        <Card body>
          <CardText>
            <b>"Participating in the mentoring program was an incredibly rewarding experience. I highly recommend it to all alumni."</b> <br/>
            <p>- John Doe, Class of 2020</p>
            <span>Read More</span>
          </CardText>
        </Card>
      </Col>
      <Col sm="4">
        <Card body>
          <CardText>
            <b>"The annual alumni events are always a highlight of my year. It's a great way to catch up with everyone and stay connected."</b><br/>
            <p>- John Doe, Class of 2020</p>
            <span>Read More</span>
          </CardText>
        </Card>
      </Col>
    </Row>
    );
}