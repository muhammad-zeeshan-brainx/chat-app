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

io.on('connection', (socket) => {
  // ...
});

httpServer.listen(3000, () => console.log(`server started at port ${port}`));
