import React, { useState } from 'react';
import axios from "axios"
import './auth.css';

function Login() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const[loading,setLoading]=useState(false);
const handleSubmit  = async (e)=>{
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const response = await axios.post('http://localhost:3001/admin/login', { email, password });
          console.log('Login successful:', response.data);
          const token = response.data.token;
          localStorage.setItem('authToken', token);
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
  return (
    <div className="container">
      <h1>Login</h1>
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
