import React, { useState } from 'react';

function Login({ onJoin }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('General');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username.trim()) return;
    onJoin(username.trim(), room);
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1 className="auth-title">Welcome to Real-Time Chat</h1>
        <p className="auth-subtitle">Choose a username and room to join the conversation.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="room">Room</label>
            <select id="room" value={room} onChange={(event) => setRoom(event.target.value)}>
              <option value="General">General</option>
              <option value="Tech Support">Tech Support</option>
            </select>
          </div>

          <button className="primary-btn" type="submit">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
