import React from 'react';
import NavigationBar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Features from '../components/Features';
import Events from '../components/Events';
import Mentorship from '../components/Mentorship';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollAnimation from '../components/ScrollAnimation';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <NavigationBar />
      <ScrollAnimation>
        <div id="hero">
          <Hero />
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={0.4}>
        <div id="about">
          <About />
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={0.4}>
        <div id="features">
          <Features />
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={0.4}>
        <div id="events">
          <Events />
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={0.4}>
        <div id="mentorship">
          <Mentorship />
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={0.4}>
        <div id="testimonials">
          <Testimonials />
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={0.4}>
        <div id="faq">
          <FAQ />
        </div>
      </ScrollAnimation>
      <ScrollAnimation delay={0.4}>
        <div id="contact">
          <Contact />
        </div>
      </ScrollAnimation>
      <Footer />
    </div>
  );
};

export default LandingPage;