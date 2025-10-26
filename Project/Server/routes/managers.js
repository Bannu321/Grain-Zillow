const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validateManagerCreation } = require('../middleware/validation');

/**
 * Manager Management Routes
 * Handles manager operations and godown management
 */

// Admin only routes
router.post('/', auth, authorize('admin'), validateManagerCreation, managerController.createManager);
router.get('/', auth, authorize('admin'), managerController.getAllManagers);
router.get('/stats', auth, authorize('admin'), managerController.getManagerStats);

// Manager-specific routes
router.get('/my-godown', auth, authorize('manager'), managerController.getMyGodown);
router.put('/my-godown', auth, authorize('manager'), managerController.updateMyGodown);
router.get('/my-storage-requests', auth, authorize('manager'), managerController.getMyStorageRequests);

// Manager status and Zillow info
router.get('/:managerId/zillow-status', auth, authorize('admin', 'manager'), managerController.getManagerZillowStatus);
router.get('/:managerId/storage-capacity', auth, authorize('admin', 'manager'), managerController.getStorageCapacity);
router.get('/:managerId', auth, authorize('admin'), managerController.getManagerById);

module.exports = router;