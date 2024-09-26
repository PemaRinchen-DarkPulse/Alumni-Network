import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import './style.css';

const Header = ({ isLoggedIn }) => {
  const [isAlumniHubOpen, setAlumniHubOpen] = useState(false);
  const [isMentorshipOpen, setMentorshipOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = (e) => {
    e.preventDefault();
    setProfileDropdownOpen(!isProfileDropdownOpen);
    setAlumniHubOpen(false);
    setMentorshipOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg py-4 fixed-top z-index-5">
      <div className="container">
        <h1>Alumni Network</h1>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded={isAlumniHubOpen}>
                Directory
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/directory/alumni" className="dropdown-item">Connect With Alumni</Link></li>
                <li><Link to="/directory/connection" className="dropdown-item">My Connection</Link></li>
                <li><Link to="/directory/forum" className="dropdown-item">Discussion Forum</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/events" className="nav-link">Events</Link>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded={isMentorshipOpen}>
                Mentorship
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/mentoring/becomeMentee" className="dropdown-item">Find a Mentor</Link></li>
                <li><Link to="/mentoring/becomeMentor" className="dropdown-item">Become a Mentor</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/news" className="nav-link">News</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
            <li className="nav-item">
              <Link to="/aboutus" className="nav-link">About Us</Link>
            </li>

            {isLoggedIn ? (
              <div>
                 <li className="nav-item dropdown profile-icon">
              <a className="nav-link btn btn-link" onClick={toggleProfileDropdown} aria-expanded={isProfileDropdownOpen}>
                <i className="fa fa-user"></i>
              </a>
              {isProfileDropdownOpen && (
                <div className="dropdown-menu profile-dropdown show">
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <Link to="/logout" className="dropdown-item">Log Out</Link>
                </div>
              )}
            </li>
              </div>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
