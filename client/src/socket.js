import { io } from 'socket.io-client';

function normalizeSocketUrl(value) {
  const rawUrl = value?.trim();

  if (!rawUrl) return '';

  try {
    const url = new URL(rawUrl);

    if (url.protocol === 'http:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      url.protocol = 'https:';
    }

    return url.origin;
  } catch {
    return rawUrl.replace(/\/+$/, '');
  }
}

const configuredSocketUrl = normalizeSocketUrl(import.meta.env.VITE_SOCKET_URL);
const localSocketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

export const socketUrl = configuredSocketUrl || localSocketUrl;
export const isSocketConfigured = Boolean(socketUrl);

const socket = isSocketConfigured ? io(socketUrl, {
  autoConnect: false,
  timeout: 30000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling']
}) : null;

export default socket;
