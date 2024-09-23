// EventCard.js
import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button, CardImg } from 'reactstrap';

const MAX_DESCRIPTION_LENGTH = 120; // Adjust this value for the approximate 3-line description

const EventCard = ({ title, date, time, location, description, onReadMore, imageUrl }) => {
  const isDescriptionLong = description.length > MAX_DESCRIPTION_LENGTH;
  const truncatedDescription = isDescriptionLong
    ? description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
    : description;

  return (
    <Card className="mb-4 shadow-sm" style={{ height: '100%' }}>
      {/* Event Image */}
      <CardImg top width="100%" src={imageUrl} alt={title} style={{ height: '200px', objectFit: 'cover' }} />

      <CardBody>
        <CardTitle tag="h5">{title}</CardTitle>

        <CardSubtitle className="mb-2 text-muted">
          📅 {date}
        </CardSubtitle>

        <CardSubtitle className="mb-2 text-muted">
          🕒 {time}
        </CardSubtitle>

        <CardSubtitle className="mb-2 text-muted">
          📍 {location}
        </CardSubtitle>

        <CardText>{truncatedDescription}</CardText>

        {isDescriptionLong && (
          <Button color="link" onClick={onReadMore}>
            Read More
          </Button>
        )}

        <Button color="primary">Register</Button>
      </CardBody>
    </Card>
  );
};

export default EventCard;
