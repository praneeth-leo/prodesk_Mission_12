import { useEffect, useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import socket from './socket';

function App() {
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('General');

  useEffect(() => {
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('joined_room');
      socket.off('receive_message');
      socket.off('show_typing');
      socket.off('hide_typing');
      socket.disconnect();
    };
  }, []);

  const handleJoin = (name, selectedRoom) => {
    setUsername(name);
    setRoom(selectedRoom);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_room', { username: name, room: selectedRoom });
    setJoined(true);
  };

  return joined ? (
    <Chat username={username} room={room} />
  ) : (
    <Login onJoin={handleJoin} />
  );
}

export default App;
