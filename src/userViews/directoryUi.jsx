import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from '../components/navbarFooter/header';
import Footer from '../components/navbarFooter/footer';
import { AlumniDirectory, AlumniForum, AlumniMessage } from "../components/directory/directory";

const DirectoryUi = ({ isLoggedIn }) => {
  const location = useLocation();

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      {location.pathname === '/directory/alumni' && <AlumniDirectory />}
      {location.pathname === '/directory/connection' && <AlumniMessage />}
      {location.pathname === '/directory/forum' && <AlumniForum />}
      {/* The Outlet will render nested routes if necessary */}
      <Outlet />
      <Footer />
    </>
  );
};

export default DirectoryUi;
