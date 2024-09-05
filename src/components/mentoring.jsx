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

            {/* Toggle buttons for switching between Mentor and Mentee form */}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
                <button 
                    onClick={() => setShowMentorForm(true)} 
                    style={{ 
                        marginRight: "10px", 
                        backgroundColor: showMentorForm ? "#007bff" : "#ccc",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Sign Up as Mentor
                </button>
                <button 
                    onClick={() => setShowMentorForm(false)} 
                    style={{ 
                        backgroundColor: !showMentorForm ? "#007bff" : "#ccc",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Sign Up as Mentee
                </button>
            </div>

            {/* Conditionally render forms based on the state */}
            {showMentorForm ? <SignUpAsMentor /> : <SignUpAsMentee />}

            <MatchingProcess />
            <Footer />
        </>
    );
}

export default Mentoring;
