import React from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/navbarFooter/header";
import { MyHero, About, GetInvolved } from "../components/hero/hero";
import { News, Events } from "../components/cards/mycard";
import Footer from "../components/navbarFooter/footer";

function HomeUi({ isLoggedIn }) {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <MyHero />
      <About />
      <News />
      <Events />
      <GetInvolved />
      <Footer />
    </>
  );
}

export default HomeUi;
