const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate.controller');
const { protect } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');
const { candidateProfileValidator } = require('../validators/profile.validator');

// All candidate routes are protected and gated
router.use(protect);
router.use(authorize('candidate'));

router.get('/profile', candidateController.getProfile);
router.put('/profile', candidateProfileValidator, candidateController.updateProfile);
router.post('/profile/resume', upload.single('resume'), candidateController.uploadResume);
router.get('/applications', candidateController.getApplications);
router.post('/saved-jobs', candidateController.toggleSaveJob);
router.get('/saved-jobs', candidateController.getSavedJobs);

module.exports = router;
