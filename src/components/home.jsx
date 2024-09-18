import React from "react";
import Header from "./header"
import Footer from "./footer"
import { MyHero,About,GetInvolved} from "./hero";
import {News,Events,Testimonials} from "./mycard"
import { Contact } from "./login/userAuthentication.jsx";
function Home(){
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

export default Home;