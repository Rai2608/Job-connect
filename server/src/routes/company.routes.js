const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const jobController = require('../controllers/job.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');
const { companyProfileValidator } = require('../validators/profile.validator');

// All company/recruiter routes are protected and gated
router.use(protect);
router.use(authorize('company'));

router.get('/profile', companyController.getProfile);
router.put('/profile', companyProfileValidator, companyController.updateProfile);
router.post('/profile/logo', upload.single('logo'), companyController.uploadLogo);

// Job management for companies
router.get('/jobs', jobController.getCompanyJobs);
router.get('/jobs/:jobId/applicants', companyController.getApplicants);
router.put('/applications/:applicationId/status', companyController.updateApplicationStatus);
router.post('/interviews', companyController.scheduleInterview);

module.exports = router;
