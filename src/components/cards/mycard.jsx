import React, { useState } from 'react';
import { Card, CardTitle, CardText, Row, Col, CardBody, CardSubtitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { NextButton, PrevButton } from '../button/button';

// Utility function to truncate text
const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// News Component
export const News = () => {
  const newsData = [
    {
      title: "Alumni Spotlight: Jane Smith",
      content: "Jane Smith, Class of 2015, shares her journey from student to CEO of a leading tech startup Random notes can serve as a flexible tool for capturing ideas, reminders, or brainstorming sessions. They don't require structure or order, making them ideal for jotting down quick thoughts before they slip away. For example, you might record ideas for a project, important tasks, or questions to research later. Random notes can help organize fragmented ideas and may later be expanded into more comprehensive content. Over time, they can serve as a creative reservoir, sparking new insights or clarifying complex concepts. The beauty of random notes lies in their adaptability and ease of use..",
    },
    {
      title: "Alumni Spotlight: John Doe",
      content: "John Doe, Class of 2010, has launched a new charity initiative to help underprivileged children.",
    },
    {
      title: "Alumni Spotlight: Mary Johnson",
      content: "Mary Johnson, Class of 2018, is recognized for her innovative work in renewable energy.",
    },
    {
      title: "Alumni Spotlight: Alex Lee",
      content: "Alex Lee, Class of 2020, has created an app that connects local farmers to urban consumers.",
    }
  ];

  const maxContentLength = 100;
  const [startIndex, setStartIndex] = useState(0);
  const newsPerPage = 3;

  const handleNext = () => {
    if (startIndex + newsPerPage < newsData.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const displayedNews = newsData.slice(startIndex, startIndex + newsPerPage);

  return (
    <section className="container mb-5">
      <div className='d-flex justify-content-between align-items-center mb-1'>
        <h3 className="ms-2 color-primary font-weight-bold">Recent News</h3>
        <Link to={"/news"} className='me-4 font-weight-bold'>See All</Link>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        {/* Previous Button */}
        <PrevButton onClick={handlePrev} disabled={startIndex === 0} />

        {/* News Cards */}
        <div className="row">
          {displayedNews.map((news, index) => (
            <div className="col-4" key={index}>
              <Card body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '250px' }}>
                <CardBody style={{ flexGrow: 1 }}>
                  <CardTitle tag="h5" className="fw-bold" style={{ minHeight: '60px' }}>
                    {news.title}
                  </CardTitle>
                  <CardText style={{ minHeight: '100px' }}>
                    {truncateText(news.content, maxContentLength)}
                  </CardText>
                </CardBody>
                <Link className='ms-3' to={`/news/${index}`}>Learn More</Link>
              </Card>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <NextButton
          onClick={handleNext}
          disabled={startIndex + newsPerPage >= newsData.length}
        />
      </div>
    </section>
  );
};

// Events Component
export const Events = () => {
  const eventsData = [
    { title: "Event Title 1", date: "September 20, 2024", description: "Details about the event. Random notes can serve as a flexible tool for capturing ideas, reminders, or brainstorming sessions. They don't require structure or order, making them ideal for jotting down quick thoughts before they slip away. For example, you might record ideas for a project, important tasks, or questions to research later. Random notes can help organize fragmented ideas and may later be expanded into more comprehensive content. Over time, they can serve as a creative reservoir, sparking new insights or clarifying complex concepts. The beauty of random notes lies in their adaptability and ease of use...", imgUrl: "https://picsum.photos/318/180" },
    { title: "Event Title 2", date: "October 5, 2024", description: "Details about the event...", imgUrl: "https://picsum.photos/318/180" },
    { title: "Event Title 3", date: "October 10, 2024", description: "Details about the event...", imgUrl: "https://picsum.photos/318/180" },
    { title: "Event Title 4", date: "October 15, 2024", description: "Details about the event...", imgUrl: "https://picsum.photos/318/180" },
    { title: "Event Title 5", date: "October 20, 2024", description: "Details about the event...", imgUrl: "https://picsum.photos/318/180" },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const eventsPerPage = 3;

  const handleNext = () => {
    if (startIndex + eventsPerPage < eventsData.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const displayedEvents = eventsData.slice(startIndex, startIndex + eventsPerPage);

  return (
    <section className="container mb-5">
      <div className='d-flex justify-content-between align-items-center mb-1'>
        <h3 className="ms-5 color-primary font-weight-bold">Upcoming Events</h3>
        <Link to={"/events"} className='me-5 font-weight-bold'>See All</Link>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        {/* Previous Button */}
        <PrevButton onClick={handlePrev} disabled={startIndex === 0} />
        <div className="row">
          {displayedEvents.map((event, index) => (
            <div className="col-4" key={index}>
              <Card className="event-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '500px' }}>
                <CardBody style={{ flexGrow: 1 }}>
                  <CardTitle tag="h5" style={{ minHeight: '30px' }}>{event.title}</CardTitle>
                  <CardSubtitle className="text-muted" tag="h6" style={{ minHeight: '10px' }}>{event.date}</CardSubtitle>
                </CardBody>
                <img alt="Event" src={event.imgUrl} width="100%" style={{ height: '200px', objectFit: 'cover' }} />
                <CardBody style={{ flexGrow: 1 }}>
                  <CardText style={{ minHeight: '70px' }}>{truncateText(event.description, 100)}</CardText>
                  <Link to={`/events/${index}`}>Learn More</Link>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <NextButton
          onClick={handleNext}
          disabled={startIndex + eventsPerPage >= eventsData.length}
        />
      </div>
    </section>
  );
};
