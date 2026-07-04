import { io } from 'socket.io-client';

const defaultSocketUrl = import.meta.env.VITE_SOCKET_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);

const socket = io(defaultSocketUrl, {
  autoConnect: false,
  transports: ['websocket']
});

export default socket;
