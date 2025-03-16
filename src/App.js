import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [userId, setUserId] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check for stored userId in local storage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="splash-screen">
        <h1>ChatApp</h1>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUserId={setUserId} userId={userId} />} />
        <Route path="/chat" element={<Chat userId={userId} setUserId={setUserId} />} />
      </Routes>
    </Router>
  );
}

export default App;