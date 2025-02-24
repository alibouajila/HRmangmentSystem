import React, {useEffect,useState } from 'react';
import axios from 'axios';
import './auth.css';
import { useNavigate } from 'react-router-dom';
function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Clear the error if passwords match
    setError('');
    setLoading(true);
    const signupData = {
      username,
      email,
      password
    };

    try {
      await axios.post('http://localhost:3001/admin/register', signupData);
      window.location.href = '/login';
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Signup failed');
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
useEffect(()=>{
    const token = localStorage.getItem('authToken')
    if(token){
        navigate('/dashboard')
    }
},[navigate])
  return (
    <div className="container">
      <h1>Sign Up</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Signup;
