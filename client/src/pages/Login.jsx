import React, {useEffect, useState } from 'react';
import axios from "axios"
import './auth.css';
import { useNavigate } from 'react-router-dom';
function Login() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const[loading,setLoading]=useState(false);
    const navigate=useNavigate()
// Function to refresh token when expired
const refreshAuthToken = async () => {
const refreshToken = localStorage.getItem('refreshToken');
if (!refreshToken) return;       
try {
 const response = await axios.post('http://localhost:3001/admin/refresh-token', { refreshToken });
localStorage.setItem('authToken', response.data.accessToken);
        } catch (error) {
console.error("Failed to refresh token", error);
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
 navigate('/login'); // Redirect to login if refresh fails
        }
    };
const handleSubmit  = async (e)=>{
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const response = await axios.post('http://localhost:3001/admin/login', { email, password });
          console.log('Login successful:', response.data);
          localStorage.setItem('authToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        window.location.href = '/dashboard';
  
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message || 'Login failed');
        } else {
          setError('Network error. Please try again later.');
        }
      } finally {
        setLoading(false); // Reset loading state
      }
    };
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
          navigate('/dashboard');
      }
      
      // Set an interval to refresh  token before it expires
      const interval = setInterval(() => {
          refreshAuthToken();
      }, 14 * 60 * 1000);         

      return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="container">
      <h1>Login</h1>
      {error}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
export default Login;
