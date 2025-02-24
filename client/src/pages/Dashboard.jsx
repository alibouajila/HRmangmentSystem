import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [error, setError] = useState('');
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('authToken');

    if (!token) {
      // If there's no token, redirect to login
      navigate('/login');
    } else {
      // Verify the token
      axios.get('http://localhost:3001/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setAdmin(response.data.admin);
        })
        .catch((error) => {
          setError(error.response ? error.response.data.message : 'An error occurred');
          navigate('/login'); // Redirect to login if token is invalid
        });
    }
  }, [navigate]);

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      {admin ? (
        <div>
          <h1>Welcome to the Dashboard, {admin.username}</h1>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
