import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Sidebar from './Sidebar';

const socket = io('https://chatappbackend-e3zq.onrender.com');

const Chat = ({ userId, setUserId, user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!selectedContact) return;

    try {
      const response = await axios.get(`https://chatappbackend-e3zq.onrender.com/api/messages/${userId}/${selectedContact}`);
      setMessages(response.data);
      const unreadMessages = response.data.filter(msg => !msg.isRead && msg.receiver === userId);
      for (const msg of unreadMessages) {
        await axios.post('https://chatappbackend-e3zq.onrender.com/api/messages/read', { messageId: msg._id });
        socket.emit('messageRead', { messageId: msg._id, sender: msg.sender, receiver: userId });
      }
      scrollToBottom();
    } catch (err) {
      setMessages([]);
      console.error('Fetch messages error:', err);
    }
  };

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
    }

    socket.on('receiveMessage', (messageData) => {
      if (messageData.sender === selectedContact && messageData.receiver === userId) {
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(msg => msg._id === messageData._id);
          if (!isDuplicate) {
            return [...prevMessages, messageData];
          }
          return prevMessages;
        });
        axios.post('https://chatappbackend-e3zq.onrender.com/api/messages/read', { messageId: messageData._id });
        socket.emit('messageRead', { messageId: messageData._id, sender: messageData.sender, receiver: userId });
        scrollToBottom();
      }
    });

    socket.on('typing', (data) => {
      if (data.sender === selectedContact && data.receiver === userId) {
        setIsTyping(true);
        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => setIsTyping(false), 2000));
      }
    });

    socket.on('messageRead', (data) => {
      if (data.sender === userId && data.receiver === selectedContact) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === data.messageId ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('messageRead');
    };
  }, [selectedContact, userId]);

  const handleTyping = () => {
    if (selectedContact) {
      socket.emit('typing', { sender: userId, receiver: selectedContact });
    }
  };

  const sendMessage = async () => {
    if (message.trim() && selectedContact) {
      const messageData = {
        sender: userId,
        receiver: selectedContact,
        message,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      try {
        const response = await axios.post('https://chatappbackend-e3zq.onrender.com/api/messages/send', messageData);
        const savedMessage = response.data;
        setMessages((prev) => [...prev, savedMessage]);
        socket.emit('sendMessage', savedMessage);
        setMessage('');
        scrollToBottom();
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <div className="App">
      <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
        ☰
      </button>

      <div className={`sidebar ${showSidebar ? 'show' : 'hide'}`}>
        <div className="user-profile">
          <img
            src={user?.profilePicture || 'https://via.placeholder.com/40'}
            alt="Profile"
            className="profile-pic"
          />
          <span>{user?.name || 'User'}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <Sidebar userId={userId} setSelectedContact={setSelectedContact} setShowSidebar={setShowSidebar} />
      </div>

      <div className="chat-container">
        {selectedContact ? (
          <>
            <div className="chat-header">
              Chat with {selectedContact.slice(-4)}
            </div>
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${msg.sender === userId ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    {msg.message}
                    <div className="message-meta">
                      <span className="timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender === userId && (
                        <span className="read-status">
                          {msg.isRead ? '✔✔' : '✔'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && <p className="typing-indicator">User is typing...</p>}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-header">Select a contact to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;