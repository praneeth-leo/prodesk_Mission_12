import { useEffect, useMemo, useRef, useState } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import socket from '../socket';

function Chat({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);

  const formattedTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleShowTyping = ({ username: sender }) => {
      if (sender !== username) {
        setTypingUser(sender);
      }
    };

    const handleHideTyping = ({ username: sender }) => {
      if (sender === typingUser) {
        setTypingUser('');
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('show_typing', handleShowTyping);
    socket.on('hide_typing', handleHideTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('show_typing', handleShowTyping);
      socket.off('hide_typing', handleHideTyping);
    };
  }, [typingUser, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleSend = (event) => {
    event.preventDefault();

    const trimmedMessage = draft.trim();
    if (!trimmedMessage) return;

    const messagePayload = {
      username,
      room,
      message: trimmedMessage,
      time: formattedTime
    };

    socket.emit('send_message', messagePayload);
    setDraft('');
  };

  const handleTyping = (event) => {
    const value = event.target.value;
    setDraft(value);

    if (value.trim()) {
      socket.emit('typing', { room, username });
    } else {
      setTypingUser('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend(event);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          <h1>Room: {room}</h1>
          <p>Chatting as {username}</p>
          <div className="meta">
            <span>Realtime chat</span>
            <span>Secure room messaging</span>
          </div>
        </div>

        <div className="chat-body">
          <div className="message-list">
            {messages.map((message, index) => (
              <Message key={`${message.time}-${index}`} message={message} username={username} />
            ))}
            <TypingIndicator typingUser={typingUser} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="chat-footer">
          <form onSubmit={handleSend}>
            <div className="input-row">
              <textarea
                value={draft}
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={2}
              />
              <button className="send-btn" type="submit">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
