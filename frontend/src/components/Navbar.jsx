import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-content">
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>GitHub</h3>
        </div>
      </Link>
      <div className="navbar-links">
        <Link to="/repos/new" className="navbar-link">
          <p>Create a Repository</p>
        </Link>
        <Link to="/profile" className="navbar-link">
          <p>Profile</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;