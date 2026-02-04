import heroImage from '../assets/images/hero.webp';
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="hero" id="home">
      <div className="hero-banner">
        <img 
          src={heroImage} 
          alt="Dream Home"
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Connecting Generations of DGI
          </h1>
          <p className="hero-subtitle">
            A dedicated platform where alumni, students, and teachers stay connected,<br />
            share opportunities, and grow together.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-gold" onClick={() => navigate('/signup')}>Join the Alumni Network </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
