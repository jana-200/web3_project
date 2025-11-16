/**
 * Modèle pour représenter un visiteur connecté
 */
class Visitor {
  constructor(socketId, location = null) {
    this.id = socketId;
    this.location = location; // { lat, lng }
    this.connectedAt = new Date();
    this.lastUpdate = new Date();
  }

  updateLocation(location) {
    this.location = location;
    this.lastUpdate = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      location: this.location,
      connectedAt: this.connectedAt.toISOString(),
      lastUpdate: this.lastUpdate.toISOString()
    };
  }
}

module.exports = Visitor;

