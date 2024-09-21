import React from 'react';
import Header from '../components/navbarFooter/header';
import Footer from '../components/navbarFooter/footer';

const AboutUsUi = ({ isLoggedIn }) => {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <div style={{ height: "100vh" }}>
        <h1 style={{ marginTop: "100px" }}>About Us</h1>
      </div>
      <Footer />
    </>
  );
}

export default AboutUsUi;
