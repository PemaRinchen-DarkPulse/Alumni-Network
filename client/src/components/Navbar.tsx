import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-text">DGI Alumni Network</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#who-this-is-for">For You</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
           <li><a href="#about">About</a></li>
          <li><a href="#contacts">Contact</a></li>
        </ul>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Log In</button>
      </div>
    </nav>
  );
};

export default Navbar;
