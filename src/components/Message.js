import React from 'react';
import './Message.css';

const Message = ({ text, isSent }) => {
  return (
    <div className={`message ${isSent ? 'sent' : 'received'}`}>
      <p>{text}</p>
    </div>
  );
};

export default Message;