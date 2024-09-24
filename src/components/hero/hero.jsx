import React from "react";
import { Button } from "reactstrap";
import "./style.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Form,FormGroup,Input } from "reactstrap";
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
                <Link to={"/mentoring"}><Button>Join Mentoring Program</Button></Link>{" "}
                <Link to={"/events"}><Button>View Upcoming Events</Button></Link>
            </div>
        </section>
    );
}

// GetInvolved Component
export const GetInvolved = () => {
    return (
        <div className="cta-section mt-5 py-5 bg-secondary text-center mb-5">
            <div className="container">
                <h2 className="text-white mb-4 display-4 font-weight-bold">Get Involved Today</h2>
                <p className="lead mb-4 text-light px-3">
                    Whether you’re looking to mentor a student, attend an event, or simply reconnect with fellow alumni, 
                    our network offers something for everyone.
                </p>
                <Link to={"/login"}>
                    <Button color="primary" size="lg" className="px-5 py-3 shadow-lg">
                        Join the Alumni Network
                    </Button>
                </Link>
            </div>
        </div>
    );
}
// About Component
export const About = () => {
    return (
        <section className="about py-5 bg-light mb-5">
            <div className="container text-center">
                <h2 className="mb-4 display-4 font-weight-bold">About the Alumni Network</h2>
                <p className="lead mb-4 text-muted">
                    Our Alumni Network is dedicated to fostering lifelong connections among our graduates. We aim to support professional growth, 
                    provide mentoring opportunities, and build a strong community that continues to thrive long after graduation.
                </p>
                <Link to={"/aboutus"}>
                    <Button color="primary" size="lg" className="px-5 py-3 shadow-lg">
                        Learn More
                    </Button>
                </Link>
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

export const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the email submission (e.g., send to backend or API)
        alert(`Thank you for subscribing with: ${email}`);
        setEmail(''); // Clear input after submission
    };

    return (
        <section className="newsletter py-5 bg-secondary text-white text-center mb-5">
            <div className="container">
                <h2 className="mb-4 display-4 font-weight-bold">Join Our Newsletter</h2>
                <p className="lead mb-4">
                    Stay updated with the latest news, events, and updates from our Alumni Network. Sign up to our newsletter today!
                </p>
                <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
                    <FormGroup className="d-flex">
                        <Input 
                            type="email"
                            placeholder="Enter your email"
                            className="form-control-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" color="primary" size="lg" className="ml-2 px-4 ms-2">
                            Subscribe
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        </section>
    );
}