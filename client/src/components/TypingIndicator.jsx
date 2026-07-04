import React from 'react';

function TypingIndicator({ typingUser }) {
  if (!typingUser) return null;

  return <div className="typing">{typingUser} is typing...</div>;
}

export default TypingIndicator;
