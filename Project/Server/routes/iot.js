const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validateDeviceControl } = require('../middleware/validation');

/**
 * IoT Control Routes
 * Handles real-time device control commands
 */

// Device control commands
router.post('/control', auth, authorize('admin', 'manager'), validateDeviceControl, iotController.controlDevice);
router.post('/control/batch', auth, authorize('admin', 'manager'), iotController.controlMultipleDevices);

// Device status and monitoring
router.get('/status/:deviceId', auth, authorize('admin', 'manager', 'user'), iotController.getDeviceStatus);
router.get('/status', auth, authorize('admin', 'manager'), iotController.getAllDevicesStatus);

// Command history and queue
router.get('/commands/pending', auth, authorize('admin', 'manager'), iotController.getPendingCommands);
router.get('/commands/history', auth, authorize('admin', 'manager'), iotController.getCommandHistory);
router.put('/commands/:commandId/cancel', auth, authorize('admin', 'manager'), iotController.cancelCommand);
router.post('/commands/:commandId/retry', auth, authorize('admin', 'manager'), iotController.retryCommand);

// Auto-control settings
router.put('/auto-control/:deviceId', auth, authorize('manager'), iotController.updateAutoControl);
router.get('/auto-control/:deviceId', auth, authorize('admin', 'manager'), iotController.getAutoControl);

// Emergency controls
router.post('/emergency/all-fans-on', auth, authorize('admin', 'manager'), iotController.emergencyAllFansOn);
router.post('/emergency/all-pumps-off', auth, authorize('admin', 'manager'), iotController.emergencyAllPumpsOff);

module.exports = router;