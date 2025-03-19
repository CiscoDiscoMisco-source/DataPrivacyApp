import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Data Privacy App</h1>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/data-types" className="nav-link">Data Types</Link>
        </li>
        <li className="nav-item">
          <Link to="/companies" className="nav-link">Companies</Link>
        </li>
        <li className="nav-item">
          <Link to="/users" className="nav-link">Users</Link>
        </li>
        <li className="nav-item">
          <Link to="/data-sharing-terms" className="nav-link">Data Sharing</Link>
        </li>
        <li className="nav-item">
          <Link to="/user-preferences" className="nav-link">User Preferences</Link>
        </li>
        <li className="nav-item">
          <Link to="/search" className="nav-link">Search</Link>
        </li>
      </ul>
      <div className="navbar-auth">
        <Link to="/login" className="nav-button">Login</Link>
        <Link to="/register" className="nav-button">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar; 