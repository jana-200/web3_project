const express = require('express');
const router = express.Router();
const visitorManager = require('../utils/visitorManager');

/**
 * GET /api/visitors
 * Retourne le nombre de visiteurs connectés
 */
router.get('/visitors', (req, res) => {
  res.json({
    count: visitorManager.getVisitorCount(),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/visitors/details
 * Retourne les détails de tous les visiteurs connectés
 */
router.get('/visitors/details', (req, res) => {
  res.json({
    visitors: visitorManager.getAllVisitors(),
    count: visitorManager.getVisitorCount(),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/visitors/locations
 * Retourne uniquement les visiteurs avec leur localisation
 */
router.get('/visitors/locations', (req, res) => {
  res.json({
    visitors: visitorManager.getVisitorsWithLocation(),
    count: visitorManager.getVisitorsWithLocation().length,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/health
 * Endpoint de santé pour vérifier que le service est opérationnel
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;

