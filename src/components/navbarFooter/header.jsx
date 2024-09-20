import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
const Header = () => {
  return (
    <header>
      <div className="container">
        <h1>Alumni Network</h1>
        <nav>
          <ul>
            <li className="text-black"><Link to="/">Home</Link></li>
            <li><Link to="/directory">Directory</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/mentoring">Mentoring</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
