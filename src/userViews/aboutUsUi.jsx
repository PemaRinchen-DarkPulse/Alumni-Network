import React, { useState } from 'react';
import Header from '../components/navbarFooter/header';
import Footer from '../components/navbarFooter/footer';
import { Benefits, FAQs, GetInvolved, MissionStatement, Purpose, TargetAudience, VisionStatement } from '../components/aboutUs/aboutUsComponent';

const AboutUsUi = ({ isLoggedIn }) => {
  const [activeSection, setActiveSection] = useState('about-network');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Inline styles
  const containerStyle = {
    padding: '20px',
    minHeight:'100vh',
    display:'flex',
    flexDirection:'column',
  };

  const contentSectionStyle = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    marginTop: '120px',
  };

  const quickLinksStyle = {
    paddingLeft: '20px',
    marginTop: '120px',
  };

  const quickLinkStyle = {
    cursor: 'pointer',
    padding: '10px 0',
    color: '#007bff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  const quickLinkHoverStyle = {
    textDecoration: 'underline',
  };

  const h1Style = {
    fontSize: '2rem',
    marginBottom: '1.5rem',
  };

  const responsiveStyle = {
    '@media (maxWidth: 991px)': {
      contentSectionStyle: { marginTop: '20px' },
      quickLinksStyle: { marginTop: '20px' },
    },
    '@media (maxWidth: 768px)': {
      quickLinksStyle: { marginTop: '20px', textAlign: 'center' },
      quickLinkStyle: { fontSize: '1rem' },
    },
    '@media (maxWidth: 576px)': {
      quickLinkStyle: { fontSize: '0.9rem' },
    },
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <div style={containerStyle}>
        <div className="row d-flex">
          <div className="col-lg-8 col-md-12" style={contentSectionStyle}>
            {activeSection === 'about-network' && (
              <div>
                <h1 style={h1Style}>About the Network</h1>
                <MissionStatement />
                <VisionStatement />
                <Purpose />
              </div>
            )}
            {activeSection === 'why-join' && (
              <div>
                <h1 style={h1Style}>Why Join & Who Can Join</h1>
                <Benefits />
                <TargetAudience />
              </div>
            )}
            {activeSection === 'how-to-engage' && (
              <div style={{minHeight:"100vh"}}>
                <h1 style={h1Style}>How to Engage</h1>
                <GetInvolved />
                <FAQs />
              </div>
            )}
          </div>

          {/* Sidebar for Quick Links */}
          <div className="col-lg-4 col-md-12" style={quickLinksStyle}>
            <h1>Quick Links</h1>
            <div
              className="quick-link"
              style={quickLinkStyle}
              onClick={() => handleSectionChange('about-network')}
              onMouseOver={(e) => (e.target.style.textDecoration = quickLinkHoverStyle.textDecoration)}
              onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
            >
              <h5>About the Network</h5>
            </div>
            <div
              className="quick-link"
              style={quickLinkStyle}
              onClick={() => handleSectionChange('why-join')}
              onMouseOver={(e) => (e.target.style.textDecoration = quickLinkHoverStyle.textDecoration)}
              onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
            >
              <h5>Why Join & Who Can Join</h5>
            </div>
            <div
              className="quick-link"
              style={quickLinkStyle}
              onClick={() => handleSectionChange('how-to-engage')}
              onMouseOver={(e) => (e.target.style.textDecoration = quickLinkHoverStyle.textDecoration)}
              onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
            >
              <h5>How to Engage</h5>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUsUi;
