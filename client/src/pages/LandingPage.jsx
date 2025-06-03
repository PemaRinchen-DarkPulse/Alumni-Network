import React from 'react'
import { Navbar } from "@/components/shared/layout/Navbar";
import { Footer } from "@/components/shared/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Features } from "@/components/landing/Features";
import { Events } from "@/components/landing/Events";
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";
import { CallToAction } from "@/components/landing/CallToAction";
const LandingPage = () => {
  return (
    <div className="min-h-svh bg-slate-950 text-slate-100">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Events />
        <Testimonials />
        <Contact />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage