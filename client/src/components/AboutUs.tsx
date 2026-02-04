const AboutUs = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content">
          {/* Left Side - About Text */}
          <div className="about-text-side">
            <h2 className="about-heading">About Our Alumni Network</h2>
            
            <p className="about-paragraph">
              Our alumni network is a vibrant community of graduates who stay connected, support each other professionally, and foster lifelong relationships.
            </p>
            
            <p className="about-paragraph">
              We provide a platform for networking, mentorship, career opportunities, and social events to help you maintain meaningful connections with fellow alumni.
            </p>
            
            <button className="btn-outline">Learn More</button>
          </div>

          {/* Right Side - Mission Card */}
          <div className="mission-card">
            <div className="mission-header">
              <div className="mission-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mission-title">Our Mission</h3>
            </div>
            
            <p className="mission-statement">
              To create a thriving, supportive community that empowers alumni to connect, collaborate, and contribute to each other's success.
            </p>
            
            <div className="mission-divider"></div>
            
            <p className="mission-description">
              We are dedicated to fostering meaningful relationships between graduates across different years and disciplines, creating opportunities for personal and professional growth.
            </p>
            
            <div className="features-grid">
              <div className="feature-box">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="feature-label">Community</span>
              </div>
              
              <div className="feature-box">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="5" r="3" stroke="#4A7CFF" strokeWidth="2"/>
                    <circle cx="6" cy="12" r="3" stroke="#4A7CFF" strokeWidth="2"/>
                    <circle cx="18" cy="19" r="3" stroke="#4A7CFF" strokeWidth="2"/>
                    <path d="M8.59 13.51L15.42 17.49" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15.41 6.51L8.59 10.49" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="feature-label">Networking</span>
              </div>
              
              <div className="feature-box">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="#4A7CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="feature-label">Mentorship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
