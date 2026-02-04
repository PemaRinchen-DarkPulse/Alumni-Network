const ProblemSolution = () => {
  return (
    <section className="problem-solution" id="problem-solution">
      <div className="ps-container">
        <div className="ps-header">
          <h2 className="ps-title">The Core Problem</h2>
          <p className="ps-subtitle">Despite having strong alumni, there is no structured, living digital ecosystem that connects them meaningfully.</p>
        </div>
        
        <div className="ps-grid">
            {/* Problems Column */}
            <div className="ps-column problem-column">
                <div className="column-header">
                    <h3>The Problems</h3>
                    <p>Challenges facing our alumni network</p>
                </div>
                <div className="ps-items">
                    <div className="ps-item">
                        <div className="ps-icon-wrapper problem-icon">
                            <span>🔗</span>
                        </div>
                        <div className="ps-text">
                            <h4>Fragmented Alumni Connections</h4>
                            <p>Connections exist mostly via WhatsApp groups, occasional events, and personal contacts. New alumni struggle to find seniors or reach out confidently.</p>
                        </div>
                    </div>
                    <div className="ps-item">
                        <div className="ps-icon-wrapper problem-icon">
                            <span>📚</span>
                        </div>
                        <div className="ps-text">
                            <h4>Loss of Institutional Memory</h4>
                            <p>Alumni achievements, projects, and learnings are not systematically documented. DGI cannot easily track who is working on what or who can mentor fellows.</p>
                        </div>
                    </div>
                    <div className="ps-item">
                        <div className="ps-icon-wrapper problem-icon">
                            <span>🤝</span>
                        </div>
                        <div className="ps-text">
                            <h4>Unsustainable Mentorship Model</h4>
                            <p>Traditional one-to-one mentorship is hard to sustain. Students have specific questions but lack an easy, low-pressure way to ask, while Alumni willing to help cannot commit to structured mentorship.</p>
                        </div>
                    </div>
                    <div className="ps-item">
                        <div className="ps-icon-wrapper problem-icon">
                            <span>📉</span>
                        </div>
                        <div className="ps-text">
                            <h4>Weak Alumni Engagement Over Time</h4>
                            <p>After graduation, engagement drops. Alumni feel disconnected from DGI's ongoing work, fellow alumni, and opportunities to contribute back.</p>
                        </div>
                    </div>
                    <div className="ps-item">
                        <div className="ps-icon-wrapper problem-icon">
                            <span>💎</span>
                        </div>
                        <div className="ps-text">
                            <h4>Underutilized Network Value</h4>
                            <p>The network could support current fellows, enable cross-sector collaboration, and strengthen Bhutan's leadership ecosystem—but this potential remains untapped.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Arrow/divider for desktop */}
            <div className="ps-divider">
                <span>➔</span>
            </div>

            {/* Solution Column */}
            <div className="ps-column solution-column">
                 <div className="column-header">
                    <h3>The Solution</h3>
                    <p>A dedicated DGI Alumni Network Platform</p>
                </div>
                <div className="ps-items">
                    <div className="ps-item">
                        <div className="ps-icon-wrapper solution-icon">
                            <span>👥</span>
                        </div>
                        <div className="ps-text">
                            <h4>Centralized Alumni Directory</h4>
                            <p>Verified alumni profiles with cohort, current role, expertise & interests. Smart search & filters by sector, skills, year, and location.</p>
                        </div>
                    </div>
                    <div className="ps-item">
                        <div className="ps-icon-wrapper solution-icon">
                            <span>🎯</span>
                        </div>
                        <div className="ps-text">
                            <h4>Community Q&A Mentorship</h4>
                            <p>A flexible, question-and-answer mentorship model where members ask questions anytime and alumni respond when available. Knowledge is shared openly and reused by the entire community.</p>
                        </div>
                    </div>
                    <div className="ps-item">
                        <div className="ps-icon-wrapper solution-icon">
                            <span>📅</span>
                        </div>
                        <div className="ps-text">
                            <h4>Events & Engagement Hub</h4>
                            <p>Digital space for alumni events, talks, roundtables, reunions & learning sessions with RSVP, reminders, and participation tracking.</p>
                        </div>
                    </div>
                    <div className="ps-item">
                        <div className="ps-icon-wrapper solution-icon">
                            <span>✍️</span>
                        </div>
                        <div className="ps-text">
                            <h4>Knowledge & Experience Sharing</h4>
                            <p>Alumni can share career journeys, lessons from leadership roles, and insights on policy, innovation, or social work—building a growing knowledge repository.</p>
                        </div>
                    </div>
                    <div className="ps-item">
                        <div className="ps-icon-wrapper solution-icon">
                            <span>🚀</span>
                        </div>
                        <div className="ps-text">
                            <h4>Collaboration & Opportunity Discovery</h4>
                            <p>Platform enables project collaboration, opportunity sharing (jobs, fellowships, initiatives), and cross-sector connections. Alumni help alumni.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
