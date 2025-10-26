const Notification = require('../models/Notification');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

/**
 * Notification Controller
 * Handles user notifications, messaging, and preferences
 */

exports.getUserNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly } = req.query;
        const skip = (page - 1) * limit;

        let query = { recipient: req.user.id };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.getUserNotifications(req.user.id, parseInt(limit), parseInt(page));

        const unreadCount = await Notification.getUnreadCount(req.user.id);

        res.json({
            success: true,
            data: {
                notifications,
                unreadCount,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: notifications.length
                }
            }
        });
    } catch (error) {
        console.error('Get user notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Notification.getUnreadCount(req.user.id);

        res.json({
            success: true,
            data: {
                unreadCount
            }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching unread count',
            error: error.message
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findOne({
            _id: notificationId,
            recipient: req.user.id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.markAsRead();

        res.json({
            success: true,
            message: 'Notification marked as read',
            data: {
                notification
            }
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { 
                recipient: req.user.id,
                isRead: false
            },
            { 
                isRead: true,
                readAt: new Date()
            }
        );

        const unreadCount = await Notification.getUnreadCount(req.user.id);

        res.json({
            success: true,
            message: 'All notifications marked as read',
            data: {
                unreadCount
            }
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking all notifications as read',
            error: error.message
        });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const result = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: req.user.id
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

exports.getPreferences = async (req, res) => {
    try {
        // In a real application, you would store notification preferences in the user model
        const user = await User.findById(req.user.id).select('notificationPreferences');
        
        const defaultPreferences = {
            email: true,
            push: true,
            storageAlerts: true,
            deviceAlerts: true,
            systemMessages: true,
            marketing: false
        };

        const preferences = user.notificationPreferences || defaultPreferences;

        res.json({
            success: true,
            data: {
                preferences
            }
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notification preferences',
            error: error.message
        });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;

        await User.findByIdAndUpdate(
            req.user.id,
            { notificationPreferences: preferences },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Notification preferences updated successfully',
            data: {
                preferences
            }
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notification preferences',
            error: error.message
        });
    }
};

exports.sendMessageToUser = async (req, res) => {
    try {
        const { userId, title, message, priority = 'normal' } = req.body;

        // Verify the sender is a manager or admin
        if (req.user.role === ROLES.USER) {
            return res.status(403).json({
                success: false,
                message: 'Only managers and admins can send messages'
            });
        }

        // Verify target user exists
        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'Target user not found'
            });
        }

        const notification = await Notification.create({
            title,
            message,
            recipient: userId,
            sender: req.user.id,
            type: 'info',
            category: 'user',
            priority,
            actionRequired: false
        });

        res.json({
            success: true,
            message: 'Message sent successfully',
            data: {
                notification
            }
        });
    } catch (error) {
        console.error('Send message to user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};

exports.broadcastToUsers = async (req, res) => {
    try {
        const { title, message, userRoles = [ROLES.USER], priority = 'normal' } = req.body;

        // Only admins can broadcast to all users
        if (req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Only admins can broadcast messages'
            });
        }

        // Get users based on roles
        const users = await User.find({ 
            role: { $in: userRoles },
            isActive: true 
        }).select('_id');

        const notifications = [];
        const errors = [];

        for (const user of users) {
            try {
                const notification = await Notification.create({
                    title,
                    message,
                    recipient: user._id,
                    sender: req.user.id,
                    type: 'info',
                    category: 'system',
                    priority,
                    actionRequired: false
                });
                notifications.push(notification);
            } catch (error) {
                errors.push({ userId: user._id, error: error.message });
            }
        }

        res.json({
            success: true,
            message: `Broadcast sent to ${notifications.length} users`,
            data: {
                sent: notifications.length,
                errors: errors.length,
                details: {
                    notifications: notifications.map(n => ({ id: n._id, recipient: n.recipient })),
                    errors
                }
            }
        });
    } catch (error) {
        console.error('Broadcast to users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error broadcasting message',
            error: error.message
        });
    }
};

exports.getAllNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 50, category, type } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (category) query.category = category;
        if (type) query.type = type;

        const notifications = await Notification.find(query)
            .populate('recipient', 'username email role')
            .populate('sender', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Notification.countDocuments(query);

        res.json({
            success: true,
            data: {
                notifications,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching all notifications',
            error: error.message
        });
    }
};

exports.notifyAllUsers = async (req, res) => {
    try {
        const { title, message, type = 'info', priority = 'normal' } = req.body;

        // Only admins can notify all users
        if (req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Only admins can notify all users'
            });
        }

        const users = await User.find({ isActive: true }).select('_id');

        const notifications = [];
        const errors = [];

        for (const user of users) {
            try {
                const notification = await Notification.createSystemNotification(
                    user._id,
                    title,
                    message,
                    { type, priority }
                );
                notifications.push(notification);
            } catch (error) {
                errors.push({ userId: user._id, error: error.message });
            }
        }

        res.json({
            success: true,
            message: `Notification sent to ${notifications.length} users`,
            data: {
                sent: notifications.length,
                errors: errors.length
            }
        });
    } catch (error) {
        console.error('Notify all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error notifying all users',
            error: error.message
        });
    }
};