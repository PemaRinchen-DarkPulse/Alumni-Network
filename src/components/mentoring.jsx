import React, { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { MatchingProcess, MentoringHeader } from "./hero";
import { SignUpAsMentee, SignUpAsMentor } from "./userAuthentication";

function Mentoring() {
    const [showMentorForm, setShowMentorForm] = useState(true); // State to toggle forms

    return (
        <>
            <Header />
            <MentoringHeader />

            <div style={{ textAlign: "center", margin: "20px 0" }}>
                <button 
                    onClick={() => setShowMentorForm(true)} 
                >
                    Sign Up as Mentor
                </button>
                <button 
                    onClick={() => setShowMentorForm(false)} 
                >
                    Sign Up as Mentee
                </button>
            </div>

            {showMentorForm ? <SignUpAsMentor /> : <SignUpAsMentee />}
            <MatchingProcess />
            <Footer />
        </>
    );
}

export default Mentoring;
