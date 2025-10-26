const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');

/**
 * User Management Routes
 * Handles user operations with role-based access control
 */

// Admin only routes
router.get('/pending-approvals', auth, authorize('admin', 'manager'), userController.getPendingApprovals);
router.get('/', auth, authorize('admin', 'manager'), userController.getAllUsers);
router.get('/stats', auth, authorize('admin'), userController.getUserStats);

// User approval/rejection by managers and admin
router.put('/:userId/approve', auth, authorize('admin', 'manager'), userController.approveUser);
router.put('/:userId/reject', auth, authorize('admin', 'manager'), userController.rejectUser);

// Role management (admin only)
router.put('/:userId/role', auth, authorize('admin'), userController.updateUserRole);
router.put('/:userId/deactivate', auth, authorize('admin'), userController.deactivateUser);

// User profile management
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.get('/:userId', auth, authorize('admin', 'manager'), userController.getUserById);

module.exports = router;