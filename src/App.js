import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

const App = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      // Fetch user details
      fetch('https://chatappbackend-e3zq.onrender.com/api/auth/user/' + storedUserId)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error('Fetch user error:', err));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginWrapper setUserId={setUserId} userId={userId} />} />
        <Route path="/chat" element={<ChatWrapper userId={userId} setUserId={setUserId} user={user} />} />
      </Routes>
    </Router>
  );
};

const LoginWrapper = ({ setUserId, userId }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (userId) navigate('/chat');
  }, [userId, navigate]);
  return <Login setUserId={setUserId} userId={userId} />;
};

const ChatWrapper = ({ userId, setUserId, user }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) navigate('/');
  }, [userId, navigate]);
  return <Chat userId={userId} setUserId={setUserId} user={user} />;
};

export default App;