const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin, validatePasswordUpdate } = require('../middleware/validation');
const auth = require('../middleware/auth');

/**
 * Authentication Routes
 * Handles user registration, login, and password management
 */
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', auth, authController.logout);
router.put('/password', auth, validatePasswordUpdate, authController.updatePassword);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;