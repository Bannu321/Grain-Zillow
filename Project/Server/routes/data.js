const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const { validateSensorData } = require('../middleware/validation');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');

/**
 * Data Routes
 * Handles sensor data ingestion and retrieval
 */

// ESP32 data ingestion (no auth required for device posting)
router.post('/sensor-data', validateSensorData, dataController.receiveSensorData);

// Protected data retrieval routes
router.get('/sensor-data', auth, authorize('admin', 'manager', 'user'), dataController.getSensorData);
router.get('/latest-data', auth, authorize('admin', 'manager', 'user'), dataController.getLatestData);
router.get('/device/:deviceId', auth, authorize('admin', 'manager', 'user'), dataController.getDeviceData);
router.get('/alerts', auth, authorize('admin', 'manager'), dataController.getAlerts);
router.get('/analytics', auth, authorize('admin', 'manager'), dataController.getAnalytics);

// Data export and reports
router.get('/export', auth, authorize('admin', 'manager'), dataController.exportData);
router.get('/reports/daily', auth, authorize('admin', 'manager'), dataController.getDailyReport);

module.exports = router;