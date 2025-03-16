import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserId, userId }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate('/chat');
    }
  }, [userId, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://chatappbackend-e3zq.onrender.com/api/auth/login', { mobile, password });
      if (response.data.message === 'Login successful') {
        setUserId(response.data.userId);
        localStorage.setItem('userId', response.data.userId);
        navigate('/chat');
      }
    } catch (err) {
      alert('Login failed: ' + err.response.data.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://chatappbackend-e3zq.onrender.com/api/auth/signup', { name, mobile, password });
      if (response.data.message === 'User created successfully') {
        setUserId(response.data.userId);
        localStorage.setItem('userId', response.data.userId);
        navigate('/chat');
      }
    } catch (err) {
      alert('Signup failed: ' + err.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isSignup ? 'Sign Up for ChatApp' : 'Login to ChatApp'}</h2>
        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        <p>
          {isSignup ? 'Already have an account?' : 'Need an account?'}
          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;