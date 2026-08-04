const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { jobCreateValidator } = require('../validators/job.validator');

// Public routes for job search and viewing details
router.get('/', jobController.listJobs);
router.get('/:id', jobController.getJobDetails);

// Recruiter specific job posting CRUD (requires company verification status check inside controller)
router.post('/', protect, authorize('company'), jobCreateValidator, jobController.createJob);
router.put('/:id', protect, authorize('company'), jobController.updateJob);
router.delete('/:id', protect, authorize('company'), jobController.archiveJob); // soft-delete

// Candidate specific application submission
router.post('/apply', protect, authorize('candidate'), jobController.applyToJob);

module.exports = router;
