const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

/**
 * Notification Routes
 * Handles user notifications and messaging
 */

// User notification management
router.get('/', auth, notificationController.getUserNotifications);
router.get('/unread-count', auth, notificationController.getUnreadCount);
router.put('/mark-all-read', auth, notificationController.markAllAsRead);
router.put('/:notificationId/read', auth, notificationController.markAsRead);
router.delete('/:notificationId', auth, notificationController.deleteNotification);

// Notification preferences
router.get('/preferences', auth, notificationController.getPreferences);
router.put('/preferences', auth, notificationController.updatePreferences);

// Manager to user messaging
router.post('/send-message', auth, notificationController.sendMessageToUser);
router.post('/broadcast', auth, notificationController.broadcastToUsers);

// Admin notification management
router.get('/admin/notifications', auth, notificationController.getAllNotifications);
router.post('/admin/notify-all', auth, notificationController.notifyAllUsers);

module.exports = router;