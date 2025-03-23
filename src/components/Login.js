import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserId, userId }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate('/chat');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const url = isSignup
        ? 'https://chatappbackend-e3zq.onrender.com/api/auth/signup'
        : 'https://chatappbackend-e3zq.onrender.com/api/auth/login';
      const response = await axios.post(url, { name: isSignup ? name : '', mobile, password });
      alert(response.data.message);
      if (response.data.userId) {
        setUserId(response.data.userId);
        localStorage.setItem('userId', response.data.userId);
        navigate('/chat');
      }
    } catch (err) {
      setError(err.response?.data.message || 'Something went wrong');
      alert(err.response?.data.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isSignup ? 'Sign Up for ChatApp' : 'Login to ChatApp'}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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