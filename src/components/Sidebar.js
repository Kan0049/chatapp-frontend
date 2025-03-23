import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ userId, setSelectedContact, setShowSidebar }) => {
  const [contacts, setContacts] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    if (!userId) {
      setContacts([]);
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://chatappbackend-e3zq.onrender.com/api/auth/users');
      const filteredContacts = response.data.filter(user => user._id !== userId);
      setContacts(filteredContacts);

      // Fetch last message for each contact
      const lastMessagesData = {};
      for (const contact of filteredContacts) {
        const messages = await axios.get(`https://chatappbackend-e3zq.onrender.com/api/messages/${userId}/${contact._id}`);
        const lastMessage = messages.data[messages.data.length - 1];
        if (lastMessage) {
          lastMessagesData[contact._id] = lastMessage.message;
        }
      }
      setLastMessages(lastMessagesData);
      setError(null);
    } catch (err) {
      setError('Failed to load contacts: ' + (err.response?.data.message || err.message));
      setContacts([]);
      console.error('Fetch contacts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [userId]);

  return (
    <div className="sidebar-content">
      <h3>Contacts</h3>
      {loading && <p>Loading contacts...</p>}
      {error && <p className="error">{error}</p>}
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <div
            key={contact._id}
            className="contact"
            onClick={() => {
              setSelectedContact(contact._id);
              setShowSidebar(false);
            }}
          >
            <img
              src={contact.profilePicture || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="profile-pic"
            />
            <div className="contact-info">
              <span className="contact-name">{contact.name}</span>
              <span className="contact-detail">{contact.mobile}</span>
              {lastMessages[contact._id] && (
                <span className="last-message">{lastMessages[contact._id]}</span>
              )}
            </div>
          </div>
        ))
      ) : (
        !loading && !error && <p>No contacts available</p>
      )}
    </div>
  );
};

export default Sidebar;