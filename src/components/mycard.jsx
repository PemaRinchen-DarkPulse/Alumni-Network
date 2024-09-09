import React from "react";
import { Card, CardTitle, CardText, Button, Row, Col, CardBody, CardSubtitle, CardLink } from "reactstrap";
import "./style.css";
export const News = () => {
  return (
    <Row className="container-fluid mt-4">
      <h1 className="text-center color-primary">Recent News</h1>
      <Col sm="4">
        <Card body>
          <CardTitle tag="h5" className="fw-bold">Alumni Spotlight: Jane Smith</CardTitle>
          <CardText>
            <p>Jane Smith, Class of 2015, shares her journey from student to CEO of a leading tech startup.</p>
          </CardText>
          <Button color="link" style={{ textAlign: 'left', display: 'block', paddingLeft: 0 }}>Learn More</Button>
        </Card>
      </Col>
      <Col sm="4">
        <Card body>
          <CardTitle tag="h5" className="fw-bold">Alumni Spotlight: Jane Smith</CardTitle>
          <CardText>
            <p>Jane Smith, Class of 2015, shares her journey from student to CEO of a leading tech startup.</p>
          </CardText>
          <Button color="link" style={{ textAlign: 'left', display: 'block', paddingLeft: 0 }}>Learn More</Button>
        </Card>
      </Col>
      <Col sm="4">
        <Card body>
          <CardTitle tag="h5" className="fw-bold">Alumni Spotlight: Jane Smith</CardTitle>
          <CardText>
            <p>Jane Smith, Class of 2015, shares her journey from student to CEO of a leading tech startup.</p>
          </CardText>
          <Button color="link" style={{ textAlign: 'left', display: 'block', paddingLeft: 0 }}>Learn More</Button>
        </Card>
      </Col>
    </Row>
  );
}

export const Events = () => {
  return (
    <section className="container UpcomingEvents m-5">
      <h1 className="text-center">Upcoming Events</h1>
      <div className="row container mx-auto">
        <div className="col-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Evens Title</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">Events Date</CardSubtitle>
            </CardBody>
            <img alt="Card cap" src="https://picsum.photos/318/180" width="100%"/>
            <CardBody>
              <CardText>Some quick example text to build on the card title and make up the bulk of the card‘s content.</CardText>
              <CardLink href="#">Learn More</CardLink>
            </CardBody>
          </Card>
        </div>
        <div className="col-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Evens Title</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">Events Date</CardSubtitle>
            </CardBody>
            <img alt="Card cap" src="https://picsum.photos/318/180" width="100%" />
            <CardBody>
              <CardText>Some quick example text to build on the card title and make up the bulk of the card‘s content.</CardText>
              <CardLink href="#">Learn More</CardLink>
            </CardBody>
          </Card>
        </div>
        <div className="col-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Evens Title</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">Events Date</CardSubtitle>
            </CardBody>
            <img alt="Card cap" src="https://picsum.photos/318/180" width="100%" />
            <CardBody>
              <CardText>Some quick example text to build on the card title and make up the bulk of the card‘s content.</CardText>
              <CardLink href="#">Learn More</CardLink>
            </CardBody>
          </Card>
        </div>
      </div>

    </section>
  );
}

export const Testimonials = () => {
  return (
    <Row className="mt-5">
      <h1 className="text-center">What Our Alumni Say</h1>
      <Col sm="4">
        <Card body>
          <CardText>
            <b>"The Alumni Network has been a great resource for reconnecting with old classmates and expanding my professional network."</b><br />
            <p>- John Doe, Class of 2020</p>
            <span>Read More</span>
          </CardText>
        </Card>
      </Col>
      <Col sm="4">
        <Card body>
          <CardText>
            <b>"Participating in the mentoring program was an incredibly rewarding experience. I highly recommend it to all alumni."</b> <br />
            <p>- John Doe, Class of 2020</p>
            <span>Read More</span>
          </CardText>
        </Card>
      </Col>
      <Col sm="4">
        <Card body>
          <CardText>
            <b>"The annual alumni events are always a highlight of my year. It's a great way to catch up with everyone and stay connected."</b><br />
            <p>- John Doe, Class of 2020</p>
            <span>Read More</span>
          </CardText>
        </Card>
      </Col>
    </Row>
  );
}