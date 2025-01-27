import React from 'react';
import Header from '../components/navbarFooter/header';
import Footer from '../components/navbarFooter/footer';
import Contact from '../components/contact/contactComponents';

const ContactUi = ({ isLoggedIn }) => {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <Contact />
      <Footer />
    </>
  );
}

export default ContactUi;
