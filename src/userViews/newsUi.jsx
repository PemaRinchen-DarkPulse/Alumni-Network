import React from 'react';
import Header from '../components/navbarFooter/header';
import Footer from '../components/navbarFooter/footer';

const NewsUi = ({ isLoggedIn }) => {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <div style={{ height: "100vh" }}>
        <h1 style={{ margin: "100px" }}>News</h1>
      </div>
      <Footer />
    </>
  );
}

export default NewsUi;
