import { useNavigate } from 'react-router-dom'

const CTA = () => {
  const navigate = useNavigate()

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Connect?</h2>
          <p className="cta-subtitle">
            Join the DGI Alumni Network and connect with thousands of alumni, students, and teachers
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary cta-btn" onClick={() => navigate('/signup')}>
              Join as Alumni
            </button>
            <button className="btn btn-secondary cta-btn" onClick={() => navigate('/signup')}>
              Join as Student
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
