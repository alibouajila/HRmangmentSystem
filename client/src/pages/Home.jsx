import React from 'react';
import {useNavigate } from 'react-router-dom';
import './home.css'; 
import { useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
 useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
          navigate('/dashboard');
      }
    }, [navigate]);
  return (
    <div className="home-container">
      <p>Please login as an Admin to use the system.</p>
      <div className="button-container">
        <button className="button login-button" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="button signup-button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Home;
