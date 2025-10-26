const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storageController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validateStorageRequest } = require('../middleware/validation');

/**
 * Storage Management Routes
 * Handles grain storage requests and management
 */

// User storage requests
router.post('/request', auth, authorize('user'), validateStorageRequest, storageController.requestStorage);
router.get('/my-storage', auth, authorize('user'), storageController.getUserStorage);
router.put('/my-storage/:storageId/cancel', auth, authorize('user'), storageController.cancelStorageRequest);
router.get('/my-storage/stats', auth, authorize('user'), storageController.getUserStorageStats);

// Manager storage approval
router.get('/pending-requests', auth, authorize('manager'), storageController.getPendingRequests);
router.put('/:storageId/approve', auth, authorize('manager'), storageController.approveStorage);
router.put('/:storageId/reject', auth, authorize('manager'), storageController.rejectStorage);
router.put('/:storageId/complete', auth, authorize('manager'), storageController.completeStorage);

// Storage management
router.get('/manager/storage', auth, authorize('manager'), storageController.getManagerStorage);
router.get('/:storageId', auth, authorize('admin', 'manager', 'user'), storageController.getStorageById);
router.put('/:storageId/quality', auth, authorize('manager'), storageController.updateQualityMetrics);

// Admin storage overview
router.get('/', auth, authorize('admin'), storageController.getAllStorage);
router.get('/admin/stats', auth, authorize('admin'), storageController.getStorageStats);

module.exports = router;