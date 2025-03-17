import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserId }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignup
        ? 'https://chatappbackend-e3zq.onrender.com/api/auth/signup'
        : 'https://chatappbackend-e3zq.onrender.com/api/auth/login';
      const response = await axios.post(url, { name: isSignup ? 'Test User' : '', mobile, password });
      alert(response.data.message); // Popup message
      if (response.data.userId) {
        setUserId(response.data.userId);
        localStorage.setItem('userId', response.data.userId);
        navigate('/chat');
      }
    } catch (err) {
      alert(err.response?.data.message || 'Something went wrong'); // Popup error
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={'Test User'} // Simplified for now
            readOnly
          />
        )}
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </p>
      </form>
    </div>
  );
};

export default Login;