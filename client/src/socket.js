import { io } from 'socket.io-client';

export const socketUrl = import.meta.env.VITE_SOCKET_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
export const isSocketConfigured = Boolean(socketUrl);

const socket = isSocketConfigured ? io(socketUrl, {
  autoConnect: false,
  timeout: 10000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling']
}) : null;

export default socket;
