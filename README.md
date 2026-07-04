# Real-Time Chat Application

A complete full-stack real-time chat app built with React, Vite, Node.js, Express, and Socket.io.

## Features

- Join a room as a user
- Send and receive messages in real time
- Typing indicator for other users
- Responsive modern UI
- Separate login and chat views

## Deployment environment variables

### Vercel client

Set this in the Vercel project for the React client, then redeploy the client:

```env
VITE_SOCKET_URL=https://your-render-service.onrender.com
```

Vite reads `VITE_*` variables at build time, so changing this variable requires a new Vercel deployment.

### Render server

Set this in the Render service for the Node server:

```env
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

For multiple frontend URLs, separate them with commas. Do not include `/socket.io` in either URL.
