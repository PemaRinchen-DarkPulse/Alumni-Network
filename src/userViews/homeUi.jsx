import React from "react";
import Header from "../components/navbarFooter/header.jsx"
import { MyHero,About,GetInvolved} from "../components/hero/hero.jsx";
import {News,Events} from "../components/cards/mycard.jsx";
import { Contact } from "../components/login/userAuthentication.jsx";
import Footer from "../components/navbarFooter/footer.jsx";
function HomeUi(){
    return (
        <>
        <Header/>
        <MyHero/>
        <About/>
        <News/>
        <Events/>
        <GetInvolved/>
        <Contact/>
        <Footer/>
        </>
    );
}
export default HomeUi;