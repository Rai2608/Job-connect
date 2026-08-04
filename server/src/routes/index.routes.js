const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const candidateRoutes = require('./candidate.routes');
const companyRoutes = require('./company.routes');
const jobRoutes = require('./job.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');
const adminController = require('../controllers/admin.controller');

// Mount routes
router.use('/auth', authRoutes);
router.use('/candidate', candidateRoutes);
router.use('/company', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

const mongoose = require('mongoose');
const env = require('../config/env');

// Health Check Endpoint
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const isAtlas = env.MONGO_URI && env.MONGO_URI.includes('mongodb+srv');

  res.json({
    status: 'ok',
    database: {
      state: states[dbState] || 'unknown',
      readyState: dbState,
      isAtlasConfigured: isAtlas,
      uriProvided: !!process.env.MONGO_URI,
    },
    nodeEnv: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Public Taxonomy Endpoint (for dropdown lists of skills & categories)
router.get('/taxonomy', adminController.listSkillCategories);

module.exports = router;
