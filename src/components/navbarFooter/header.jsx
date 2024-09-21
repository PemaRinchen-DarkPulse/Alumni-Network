import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const Header = ({ isLoggedIn }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header>
      <div className="container">
        <h1>Alumni Network</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/directory">Directory</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/mentoring">Mentoring</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            {isLoggedIn ? (
              <li className="profile-icon">
                <Link to="#" onClick={toggleDropdown}>
                  <i className="fa fa-user"></i>
                </Link>
                {isDropdownOpen && (
                  <div className="dropdown">
                    <Link to="/settings">Settings</Link>
                    <Link to="/logout">Log Out</Link>
                  </div>
                )}
              </li>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
