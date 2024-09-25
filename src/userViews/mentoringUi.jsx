import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from '../components/navbarFooter/header';
import Footer from '../components/navbarFooter/footer';
import { AlumniDirectory, AlumniForum, AlumniMessage } from "../components/directory/directory";
import { BecomeMentor} from "../components/mentoring/mentor";
import {Mentee} from "../components/mentoring/mentee";
const MentoringUi = ({ isLoggedIn }) => {
  const location = useLocation();

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      {location.pathname === '/mentoring/becomeMentor' && <BecomeMentor />}
      {location.pathname === '/mentoring/becomeMentee' && <Mentee />}
      {/* The Outlet will render nested routes if necessary */}
      <Outlet />
      <Footer />
    </>
  );
};

export default MentoringUi;
