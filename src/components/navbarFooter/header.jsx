import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const Header = ({ isLoggedIn }) => {
  const [isAlumniHubOpen, setAlumniHubOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleAlumniHubDropdown = () => {
    setAlumniHubOpen(!isAlumniHubOpen);
    setProfileDropdownOpen(false); // Close the profile dropdown if it's open
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
    setAlumniHubOpen(false); // Close the alumni hub dropdown if it's open
  };

  return (
    <header>
      <div className="container">
        <h1>Alumni Network</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li className="directory">
              <Link to="#" onClick={toggleAlumniHubDropdown}>
                Directory
              </Link>
              {isAlumniHubOpen && (
                <div className="dropdown alumni-hub-dropdown">
                  <Link to="/directory/alumni">Connect With Alumni</Link>
                  <Link to="/directory/connection">My Connection</Link>
                  <Link to="/directory/forum">Discussion Forum</Link>
                </div>
              )}
            </li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/mentoring">Mentoring</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            {isLoggedIn ? (
              <li className="profile-icon" onClick={toggleProfileDropdown}>
                <Link to="#">
                  <i className="fa fa-user"></i>
                </Link>
                {isProfileDropdownOpen && (
                  <div className="dropdown profile-dropdown">
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
