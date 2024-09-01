import React from "react";
import "./style.css"

const Header=()=>{
    return (
      <header>
        <div className="container">
            <h1>Alumni Network</h1>
            <nav>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="directory.html">Directory</a></li>
                    <li><a href="events.html">Events</a></li>
                    <li><a href="mentoring.html">Mentoring</a></li>
                    <li><a href="news.html">News</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="login.html">Login</a></li>
                </ul>
            </nav>
        </div>
    </header>
    );
}

export default Header;