const Visitor = require('../models/Visitor');

/**
 * Gestionnaire centralisé des visiteurs connectés
 */
class VisitorManager {
  constructor() {
    this.visitors = new Map(); // Map<socketId, Visitor>
  }

  /**
   * Ajoute un nouveau visiteur
   */
  addVisitor(socketId, location = null) {
    const visitor = new Visitor(socketId, location);
    this.visitors.set(socketId, visitor);
    return visitor;
  }

  /**
   * Supprime un visiteur
   */
  removeVisitor(socketId) {
    return this.visitors.delete(socketId);
  }

  /**
   * Met à jour la localisation d'un visiteur
   */
  updateVisitorLocation(socketId, location) {
    const visitor = this.visitors.get(socketId);
    if (visitor) {
      visitor.updateLocation(location);
      return visitor;
    }
    return null;
  }

  /**
   * Récupère un visiteur par son socketId
   */
  getVisitor(socketId) {
    return this.visitors.get(socketId);
  }

  /**
   * Récupère tous les visiteurs
   */
  getAllVisitors() {
    return Array.from(this.visitors.values()).map(v => v.toJSON());
  }

  /**
   * Récupère le nombre de visiteurs connectés
   */
  getVisitorCount() {
    return this.visitors.size;
  }

  /**
   * Récupère les visiteurs avec leur localisation
   */
  getVisitorsWithLocation() {
    return this.getAllVisitors().filter(v => v.location !== null);
  }
}

// Instance singleton
const visitorManager = new VisitorManager();

module.exports = visitorManager;

