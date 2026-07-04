import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import socket, { isSocketConfigured, socketUrl } from './socket';

function App() {
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('General');
  const [connectionStatus, setConnectionStatus] = useState(isSocketConfigured ? 'Disconnected' : 'Backend not configured');
  const [connectionError, setConnectionError] = useState('');

  useEffect(() => {
    if (!socket) return undefined;

    const handleConnect = () => {
      setConnectionStatus('Connected');
      setConnectionError('');
    };

    const handleDisconnect = () => {
      setConnectionStatus('Disconnected');
    };

    const handleConnectError = (error) => {
      setConnectionStatus('Connection failed');
      setConnectionError(error.message || 'Unable to connect to the chat server.');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('joined_room');
      socket.off('receive_message');
      socket.off('show_typing');
      socket.off('hide_typing');
      socket.disconnect();
    };
  }, []);

  const handleJoin = (name, selectedRoom) => {
    if (!socket) {
      setConnectionError('Set VITE_SOCKET_URL in Vercel to your Render backend URL, then redeploy.');
      return;
    }

    setUsername(name);
    setRoom(selectedRoom);
    setConnectionStatus(socket.connected ? 'Connected' : 'Connecting...');

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_room', { username: name, room: selectedRoom });
    setJoined(true);
  };

  return joined ? (
    <Chat username={username} room={room} connectionStatus={connectionStatus} connectionError={connectionError} />
  ) : (
    <Login
      onJoin={handleJoin}
      connectionStatus={connectionStatus}
      connectionError={connectionError}
      socketUrl={socketUrl}
    />
  );
}

export default App;
