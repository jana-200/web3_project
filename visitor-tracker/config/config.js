require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',') 
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'],
    credentials: true
  },
  socket: {
    path: process.env.SOCKET_PATH || '/socket.io',
    cors: {
      origin: process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',') 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'],
      credentials: true
    }
  }
};

