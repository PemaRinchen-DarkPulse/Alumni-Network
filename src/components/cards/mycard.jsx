import React from "react";
import { Card, CardTitle, CardText, Row, Col, CardBody, CardSubtitle, CardLink } from "reactstrap";
import "./style.css";

export const News = () => {
  const newsData = [
    {
      title: "Alumni Spotlight: Jane Smith",
      content: "Jane Smith, Class of 2015, shares her journey from student to CEO of a leading tech startup.",
    },
    {
      title: "Alumni Spotlight: John Doe",
      content: "John Doe, Class of 2010, has launched a new charity initiative to help underprivileged children.",
    },
    {
      title: "Alumni Spotlight: John Doe",
      content: "John Doe, Class of 2010, has launched a new charity initiative to help underprivileged children.",
    },
    // Add more news items here
  ];

  return (
    <Row className="container mt-4">
      <h1 className="text-center color-primary">Recent News</h1>
      {newsData.map((news, index) => (
        <Col sm="4" key={index}>
          <Card body>
            <CardTitle tag="h5" className="fw-bold">{news.title}</CardTitle>
            <CardText>{news.content}</CardText>
            <CardLink href="#">Learn More</CardLink>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export const Events = () => {
  const eventsData = [
    {
      title: "Event Title 1",
      date: "September 20, 2024",
      description: "Details about the event...",
      imgUrl: "https://picsum.photos/318/180",
    },
    {
      title: "Event Title 2",
      date: "October 5, 2024",
      description: "Details about the event...",
      imgUrl: "https://picsum.photos/318/180",
    },
    {
      title: "Event Title 2",
      date: "October 5, 2024",
      description: "Details about the event...",
      imgUrl: "https://picsum.photos/318/180",
    },
    // Add more event items here
  ];

  return (
    <section className="container UpcomingEvents m-5">
      <h1 className="text-center">Upcoming Events</h1>
      <div className="row container mx-auto">
        {eventsData.map((event, index) => (
          <div className="col-4" key={index}>
            <Card>
              <CardBody>
                <CardTitle tag="h5">{event.title}</CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">{event.date}</CardSubtitle>
              </CardBody>
              <img alt="Event" src={event.imgUrl} width="100%" />
              <CardBody>
                <CardText>{event.description}</CardText>
                <CardLink href="#">Learn More</CardLink>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
