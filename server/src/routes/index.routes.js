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

// Public Taxonomy Endpoint (for dropdown lists of skills & categories)
router.get('/taxonomy', adminController.listSkillCategories);

module.exports = router;
