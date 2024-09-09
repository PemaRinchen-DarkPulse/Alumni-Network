import React from "react";
import { Button } from "reactstrap";
import "./style.css";

// MyHero Component
export const MyHero = () => {
    return (
        <section className="container-fluid mb-5" id="home" 
            style={{
                backgroundImage: "url('./hero.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
            }}>
            <div className="p-4 rounded-4 pema">
                <h1>Royal Academy Alumni Network: Bridging Past and Future</h1>
                <h5>Welcome to the Royal Academy Hub! Immerse yourself in a dynamic community where the
                    spirit of excellence extends far beyond our historic halls. Reconnect with fellow alumni, discover
                    fresh avenues for growth, and stay updated on the latest innovations and groundbreaking research
                    emanating from the Royal Academy.
                </h5>
                <Button>Join Mentoring Program</Button>{" "}
                <Button>View Upcoming Events</Button>
            </div>
        </section>
    );
}

// GetInvolved Component
export const GetInvolved = () => {
    return (
        <div className="cta-section mt-5">
            <div className="container">
                <h2 color="primary">Get Involved Today</h2>
                <p>Whether you’re looking to mentor a student, attend an event, or simply reconnect with fellow alumni, our network has something for everyone.</p>
                <Button color="primary" outline>Join the Alumni Network</Button>
            </div>
        </div>
    );
}

// About Component
export const About = () => {
    return (
        <section className="about">
            <div className="container about">
                <h2>About the Alumni Network</h2>
                <p>Our Alumni Network is dedicated to fostering lifelong connections among our graduates. We aim to support professional growth, provide mentoring opportunities, and build a strong community that continues to thrive long after graduation.</p>
                <a href="about.html" className="cta-link">Learn More</a>
            </div>
        </section>
    );
}

// MentoringHeader Component
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

// MatchingProcess Component
export const MatchingProcess = () => {
    return (
        <div className="matching-process">
            <h3>How the Matching Process Works</h3>
            <p>Our coordinators will review your application and match you with a suitable mentor or mentee based on your preferences and availability.</p>
        </div>
    );
}
