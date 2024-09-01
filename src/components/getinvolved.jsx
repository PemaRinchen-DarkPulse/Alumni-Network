import React from "react";
import { Button } from "reactstrap";
export const GetInvolved=()=>{
    return (
        <>
        <section class="cta-section">
            <div class="container">
                <h2 color="primary">Get Involved Today</h2>
                <p>Whether you’re looking to mentor a student, attend an event, or simply reconnect with fellow alumni, our network has something for everyone.</p>
                <Button color="primary" outline>Join the Alumni Network</Button>
            </div>
        </section>
        </>
    );
}

export const About=()=>{
    return (
        <section class="about">
            <div class="container">
                <h2>About the Alumni Network</h2>
                <p>Our Alumni Network is dedicated to fostering lifelong connections among our graduates. We aim to support professional growth, provide mentoring opportunities, and build a strong community that continues to thrive long after graduation.</p>
                <a href="about.html" class="cta-link">Learn More</a>
            </div>
        </section>
    );
}