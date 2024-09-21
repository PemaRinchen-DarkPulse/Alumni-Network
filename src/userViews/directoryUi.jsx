import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/navbarFooter/header';
import Footer from '../components/navbarFooter/footer';

const DirectoryUi = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("Redirecting to login from:", window.location.pathname);
      navigate('/login', { state: { from: window.location.pathname } });
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <div style={{ height: "100vh" }}>
        <h1 style={{ marginTop: "190px" }}>Directory</h1>
      </div>
      <Footer />
    </>
  );
};

export default DirectoryUi;
