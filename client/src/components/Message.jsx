import React from 'react';

function Message({ message, username }) {
  const isOwn = message.username === username;

  return (
    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
      <div className="message-meta">
        <strong>{message.username}</strong>
        <span>{message.time}</span>
      </div>
      <div className="message-text">{message.message}</div>
    </div>
  );
}

export default Message;
