const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Realtime chat server is running');
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', ({ username, room }) => {
    if (!username || !room) return;

    socket.data.username = username;
    socket.data.room = room;

    socket.join(room);
    socket.emit('joined_room', { room, username });
  });

  socket.on('send_message', ({ username, room, message, time }) => {
    if (!room || !message || !message.trim()) return;

    const payload = {
      username,
      room,
      message: message.trim(),
      time
    };

    io.to(room).emit('receive_message', payload);
  });

  socket.on('typing', ({ room, username }) => {
    if (!room || !username) return;

    socket.to(room).emit('show_typing', { username });

    if (socket.data.typingTimer) {
      clearTimeout(socket.data.typingTimer);
    }

    socket.data.typingTimer = setTimeout(() => {
      socket.to(room).emit('hide_typing', { username });
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected');

    if (socket.data.typingTimer) {
      clearTimeout(socket.data.typingTimer);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
