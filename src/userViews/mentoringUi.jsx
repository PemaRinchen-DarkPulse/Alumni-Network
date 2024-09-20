import React from "react";
import Header from "../components/navbarFooter/header";
import Footer from "../components/navbarFooter/footer";

const MentoringUi=()=>{
    return (
        <>
        <Header/>
        <div style={{height:"100vh"}}>
        <h1>if user is not a mentor/ mentee show thm=em the page with regirtarion if he is mentor show them the dashbiard</h1>
        </div>
        <Footer/>
        </>
    );
}

export default MentoringUi;