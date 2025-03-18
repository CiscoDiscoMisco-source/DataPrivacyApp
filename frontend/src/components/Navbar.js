import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Data Privacy Manager</Link>
        
        <div className="navbar-nav">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/companies" className="nav-link">Companies</Link>
          <Link to="/preferences" className="nav-link">Preferences</Link>
          
          <div className="navbar-user">
            {currentUser && (
              <span className="nav-link">
                {currentUser.username} | <button onClick={logout} className="btn-link">Logout</button>
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 