import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ userId, setSelectedContact }) => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!userId) {
        setContacts([]);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/users');
        const filteredContacts = response.data.filter(user => user._id !== userId);
        setContacts(filteredContacts);
        setError(null);
      } catch (err) {
        setError('Failed to load contacts: ' + (err.response?.data.message || err.message));
        setContacts([]);
      }
    };
    fetchContacts();
  }, [userId]);

  return (
    <div className="sidebar">
      <h3>Contacts</h3>
      {error && <p className="error">{error}</p>}
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <div
            key={contact._id}
            className="contact"
            onClick={() => setSelectedContact(contact._id)}
          >
            <img
              src={contact.profilePicture || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="profile-pic"
            />
            <div className="contact-info">
              <span className="contact-name">{contact.name}</span>
              <span className="contact-detail">{contact.mobile}</span>
            </div>
          </div>
        ))
      ) : (
        <p>No contacts available</p>
      )}
    </div>
  );
};

export default Sidebar;