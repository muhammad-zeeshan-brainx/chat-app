const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const genrateUniqueId = () => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

const connectedUsers = new Map();

io.use((socket, next) => {
  console.log('hand shaking..');
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  console.log('someone connected to socket: ', socket.id, socket?.username);

  socket.on('users', () => {
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
      connectedUsers.set(id, { username: socket.username, id: id });
    }
    io.emit('users', Array.from(connectedUsers));

    socket.emit('newUser', { id: socket.id, username: socket.username });
  });

  // Listen for the 'disconnect' event from the client
  socket.on('disconnect', () => {
    console.log('A user disconnected.');

    // Find the disconnected user's username using their socket.id
    const disconnectedUser = connectedUsers.get(socket.id);

    // If the disconnectedUser is found, get their username
    const disconnectedUsername = disconnectedUser
      ? disconnectedUser.username
      : null;
    if (disconnectedUsername) {
      // Broadcast the disconnected username to all connected clients
      io.emit('userDisconnected', disconnectedUser);
      // Remove the disconnected user from the list
      connectedUsers.delete(disconnectedUser.id);
    }
  });
});

// ...

httpServer.listen(port, () => console.log(`server started at port ${port}`));
