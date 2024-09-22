import React from 'react';
import Header from '../components/navbarFooter/header';
import Footer from '../components/navbarFooter/footer';
import {EventsList} from '../components/events/EventsList';

const EventsUi = ({ isLoggedIn }) => {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <EventsList/>
      <Footer />
    </>
  );
}

export default EventsUi;
