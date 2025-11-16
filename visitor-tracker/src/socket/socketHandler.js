const visitorManager = require('../utils/visitorManager');

/**
 * Gère les événements Socket.io
 */
function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Nouveau visiteur connecté: ${socket.id}`);

    // Ajouter le visiteur à la liste
    visitorManager.addVisitor(socket.id);

    // Envoyer le nombre actuel de visiteurs au nouveau client
    socket.emit('visitor-count', {
      count: visitorManager.getVisitorCount()
    });

    // Diffuser à tous les autres clients qu'un nouveau visiteur s'est connecté
    socket.broadcast.emit('visitor-joined', {
      count: visitorManager.getVisitorCount()
    });

    // Écouter la localisation du visiteur
    socket.on('location', (data) => {
      const { lat, lng } = data;
      
      if (lat && lng) {
        // Mettre à jour la localisation du visiteur
        const visitor = visitorManager.updateVisitorLocation(socket.id, { lat, lng });
        
        if (visitor) {
          // Diffuser la localisation à tous les autres clients
          socket.broadcast.emit('visitor-location', {
            visitorId: socket.id,
            location: { lat, lng }
          });

          // Envoyer toutes les localisations au client qui vient de partager sa position
          socket.emit('all-locations', {
            visitors: visitorManager.getVisitorsWithLocation()
          });
        }
      }
    });

    // Écouter les demandes de mise à jour du nombre de visiteurs
    socket.on('get-visitor-count', () => {
      socket.emit('visitor-count', {
        count: visitorManager.getVisitorCount()
      });
    });

    // Écouter les demandes de toutes les localisations
    socket.on('get-all-locations', () => {
      socket.emit('all-locations', {
        visitors: visitorManager.getVisitorsWithLocation()
      });
    });

    // Gérer la déconnexion
    socket.on('disconnect', () => {
      console.log(`Visiteur déconnecté: ${socket.id}`);
      
      // Retirer le visiteur de la liste
      visitorManager.removeVisitor(socket.id);

      // Diffuser à tous les clients qu'un visiteur s'est déconnecté
      socket.broadcast.emit('visitor-left', {
        visitorId: socket.id,
        count: visitorManager.getVisitorCount()
      });
    });
  });
}

module.exports = setupSocketHandlers;

