const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

router.post('/register', registerValidator, authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', loginValidator, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, authController.resetPassword);

module.exports = router;
