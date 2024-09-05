import React from "react";
import { Button } from "reactstrap";
import { SecondButton } from "./buttonSample"
import "./style.css"
export const MyHero = () => {
    return (
        <section className="hero">
            <div className="container">
                <h2>Welcome to the Alumni Network</h2>
                <p>Join us and connect with fellow alumni.</p>
                <SecondButton />
                <SecondButton />
            </div>
        </section>
    );
}
export const GetInvolved = () => {
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

export const About = () => {
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

export const MentoringHeader = () => {
    return (
        <>
            <h2>Join Our Mentoring Program</h2>
            <p>Connect with fellow alumni and support career development through mentoring.</p>
            <p><strong>As a Mentor:</strong> Share your expertise and guide a mentee.</p>
            <p><strong>As a Mentee:</strong> Gain valuable insights and advice from an experienced mentor.</p>
        </>
    );
}

export const MatchingProcess = () => {
    return (
        <div class="matching-process">
            <h3>How the Matching Process Works</h3>
            <p>Our coordinators will review your application and match you with a suitable mentor or mentee based on your preferences and availability.</p>
        </div>
    );
}