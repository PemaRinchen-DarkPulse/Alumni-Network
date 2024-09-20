import React from "react";
import Header from "../components/navbarFooter/header.jsx"
import Footer from "../components/navbarFooter/footer.jsx"
import { MyHero,About,GetInvolved} from "../components/hero/hero.jsx";
import {News,Events,Testimonials} from "../components/cards/mycard.jsx"
import { Contact } from "../components/login/userAuthentication.jsx";
function HomeUi(){
    return (
        <>
        <Header/>
        <MyHero/>
        <About/>
        <News/>
        <Events/>
        <Testimonials/>
        <GetInvolved/>
        <Contact/>
        <Footer/>
        </>
    );
}

export default HomeUi;