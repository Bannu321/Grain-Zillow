const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validateDeviceRegistration } = require('../middleware/validation');

/**
 * Device Management Routes
 * Handles ESP32 device registration and management
 */

// Device registration and listing
router.post('/register', auth, authorize('manager'), validateDeviceRegistration, deviceController.registerDevice);
router.get('/', auth, authorize('admin', 'manager', 'user'), deviceController.getAllDevices);
router.get('/my-devices', auth, authorize('manager'), deviceController.getMyDevices);

// Device status and updates
router.get('/stats', auth, authorize('admin', 'manager'), deviceController.getDeviceStats);
router.get('/:deviceId', auth, authorize('admin', 'manager', 'user'), deviceController.getDeviceById);
router.put('/:deviceId/status', auth, authorize('manager'), deviceController.updateDeviceStatus);
router.put('/:deviceId/configuration', auth, authorize('manager'), deviceController.updateDeviceConfiguration);

// Device maintenance
router.put('/:deviceId/maintenance', auth, authorize('manager'), deviceController.setMaintenanceMode);
router.delete('/:deviceId', auth, authorize('manager'), deviceController.deleteDevice);

module.exports = router;