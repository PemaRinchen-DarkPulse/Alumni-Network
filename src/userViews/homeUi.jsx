import React from "react";
import Header from "../components/navbarFooter/header";
import { MyHero, About, GetInvolved, Newsletter } from "../components/hero/hero";
import { News, Events } from "../components/cards/mycard";
import Footer from "../components/navbarFooter/footer";

function HomeUi({ isLoggedIn }) {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <MyHero />
      <About />
      <News />
      
      {/* Conditionally render based on login status */}
      {!isLoggedIn ? <GetInvolved /> : <Newsletter />}
      
      <Events />
      <Footer />
    </>
  );
}
export default HomeUi;
