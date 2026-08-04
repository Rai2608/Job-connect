const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// All admin routes are protected and gated
router.use(protect);
router.use(authorize('admin'));

// Company moderation
router.get('/companies/pending', adminController.getPendingCompanies);
router.put('/companies/:companyId/verify', adminController.verifyCompany);

// User moderation
router.get('/users', adminController.listUsers);
router.put('/users/:userId/suspend', adminController.toggleUserSuspension);

// Job moderation
router.get('/jobs', adminController.listJobs);
router.put('/jobs/:jobId/moderate', adminController.moderateJob);

// Taxonomy CRUD
router.post('/taxonomy', adminController.createSkillCategory);
router.delete('/taxonomy/:id', adminController.deleteSkillCategory);

// Dashboard stats
router.get('/analytics', adminController.getDashboardAnalytics);

module.exports = router;
