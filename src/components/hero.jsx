import React from "react";
import {SecondButton} from "./buttonSample"
import "./style.css"
const MyHero=()=>{
    return (
        <section className="hero">
            <div className="container">
                <h2>Welcome to the Alumni Network</h2>
                <p>Join us and connect with fellow alumni.</p>
                <SecondButton/>
                <SecondButton/>
            </div>
        </section>
    );
}

export default MyHero;