import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const navigate = useNavigate();
  
  // Check if the token exists in localStorage
  const token = localStorage.getItem('authToken');

  // Logout function to clear the token and redirect to the login page
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token from localStorage
    localStorage.removeItem("refreshToken") //Remove the refresh-token from localstorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-link">Home</Link>
      </div>
      <div className="nav-right">
        {token ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
