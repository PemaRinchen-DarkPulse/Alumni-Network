import React from "react";
import Header from "./header";
import Footer from "./footer";
import {MatchingProcess, MentoringHeader} from "./hero"
import { SignUpAsMentor } from "./userAuthentication";
function Mentoring(){
    return(
        <>
        <Header/>
        <MentoringHeader/>
        <SignUpAsMentor/>
        <MatchingProcess/>
        <Footer/>
        </>
    );
}

export default Mentoring;