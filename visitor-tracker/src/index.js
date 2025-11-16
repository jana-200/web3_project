const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const config = require('../config/config');
const apiRoutes = require('./routes/api');
const setupSocketHandlers = require('./socket/socketHandler');

// Créer l'application Express
const app = express();
const server = http.createServer(app);

// Configurer Socket.io
const io = new Server(server, {
  path: config.socket.path,
  cors: config.socket.cors
});

// Middlewares
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, '../public')));

// Routes API REST
app.use('/api', apiRoutes);

// Route par défaut - servir l'interface client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Configurer les handlers Socket.io
setupSocketHandlers(io);

// Démarrer le serveur
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 Socket.io disponible sur ${config.socket.path}`);
  console.log(`🌐 Interface client: http://localhost:${PORT}`);
  console.log(`📊 API REST: http://localhost:${PORT}/api`);
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
});

module.exports = { app, server, io };

