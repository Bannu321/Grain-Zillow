const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Notification Service
 * Handles notification delivery and management
 */
class NotificationService {
    constructor() {
        this.channels = ['in_app', 'email', 'push']; // Available notification channels
    }

    // Send notification to single user
    async sendNotification(userId, notificationData) {
        try {
            const notification = await Notification.create({
                ...notificationData,
                recipient: userId
            });

            // Here you would integrate with email services, push notification services, etc.
            await this.deliverThroughChannels(userId, notification);

            return notification;
        } catch (error) {
            console.error('Send notification error:', error);
            throw new Error('Failed to send notification');
        }
    }

    // Send notification to multiple users
    async broadcastNotification(userIds, notificationData) {
        try {
            const notifications = [];
            const errors = [];

            for (const userId of userIds) {
                try {
                    const notification = await this.sendNotification(userId, notificationData);
                    notifications.push(notification);
                } catch (error) {
                    errors.push({ userId, error: error.message });
                }
            }

            return {
                sent: notifications.length,
                failed: errors.length,
                notifications,
                errors
            };
        } catch (error) {
            console.error('Broadcast notification error:', error);
            throw new Error('Failed to broadcast notification');
        }
    }

    // Send notification to users by role
    async broadcastToRole(role, notificationData) {
        try {
            const users = await User.find({ role, isActive: true }).select('_id');
            const userIds = users.map(user => user._id);

            return await this.broadcastNotification(userIds, notificationData);
        } catch (error) {
            console.error('Broadcast to role error:', error);
            throw new Error('Failed to broadcast to role');
        }
    }

    // System alerts
    async sendSystemAlert(title, message, priority = 'high') {
        try {
            const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
            
            const notificationData = {
                title,
                message,
                type: 'alert',
                category: 'system',
                priority,
                actionRequired: true
            };

            return await this.broadcastNotification(
                admins.map(admin => admin._id),
                notificationData
            );
        } catch (error) {
            console.error('Send system alert error:', error);
            throw new Error('Failed to send system alert');
        }
    }

    // Storage-related notifications
    async notifyStorageApproval(storage) {
        try {
            const notificationData = {
                title: 'Storage Request Approved',
                message: `Your storage request for ${storage.quantity}kg of ${storage.grainType} has been approved.`,
                type: 'success',
                category: 'storage',
                priority: 'normal',
                actionRequired: false,
                metadata: { storageId: storage.storageId, action: 'approved' }
            };

            return await this.sendNotification(storage.userId, notificationData);
        } catch (error) {
            console.error('Notify storage approval error:', error);
            throw new Error('Failed to send storage approval notification');
        }
    }

    async notifyStorageRejection(storage, reason = '') {
        try {
            const message = reason 
                ? `Your storage request has been rejected. Reason: ${reason}`
                : 'Your storage request has been rejected.';

            const notificationData = {
                title: 'Storage Request Rejected',
                message,
                type: 'error',
                category: 'storage',
                priority: 'normal',
                actionRequired: false,
                metadata: { storageId: storage.storageId, action: 'rejected' }
            };

            return await this.sendNotification(storage.userId, notificationData);
        } catch (error) {
            console.error('Notify storage rejection error:', error);
            throw new Error('Failed to send storage rejection notification');
        }
    }

    // Device alert notifications
    async notifyDeviceAlert(deviceId, alert, userIds = null) {
        try {
            let targetUserIds = userIds;

            if (!targetUserIds) {
                // If no specific users provided, notify device manager and admins
                const Device = require('../models/Device');
                const device = await Device.findOne({ deviceId }).populate('managerId');
                
                if (!device) {
                    throw new Error('Device not found');
                }

                const manager = await User.findById(device.managerId.userId);
                const admins = await User.find({ role: 'admin', isActive: true }).select('_id');

                targetUserIds = [manager._id, ...admins.map(admin => admin._id)];
            }

            const notificationData = {
                title: `Device Alert: ${alert.type}`,
                message: `Device ${deviceId}: ${alert.message}`,
                type: 'alert',
                category: 'device',
                priority: alert.type === 'gas_leak' || alert.type === 'high_temperature' ? 'urgent' : 'high',
                actionRequired: true,
                actionUrl: `/devices/${deviceId}`,
                actionLabel: 'View Device',
                metadata: { deviceId, alert }
            };

            return await this.broadcastNotification(targetUserIds, notificationData);
        } catch (error) {
            console.error('Notify device alert error:', error);
            throw new Error('Failed to send device alert notification');
        }
    }

    // User registration notifications
    async notifyNewUserRegistration(user) {
        try {
            const admins = await User.find({ role: 'admin', isActive: true }).select('_id');

            const notificationData = {
                title: 'New User Registration',
                message: `New user ${user.username} has registered and is waiting for approval.`,
                type: 'info',
                category: 'user',
                priority: 'normal',
                actionRequired: true,
                actionUrl: '/admin/users/pending',
                actionLabel: 'Review Users'
            };

            return await this.broadcastNotification(
                admins.map(admin => admin._id),
                notificationData
            );
        } catch (error) {
            console.error('Notify new user registration error:', error);
            throw new Error('Failed to send new user registration notification');
        }
    }

    // Cleanup old notifications
    async cleanupExpiredNotifications() {
        try {
            const result = await Notification.deleteMany({
                expiresAt: { $lt: new Date() }
            });

            console.log(`🧹 Cleaned up ${result.deletedCount} expired notifications`);
            return result.deletedCount;
        } catch (error) {
            console.error('Cleanup expired notifications error:', error);
            throw new Error('Failed to cleanup expired notifications');
        }
    }

    // Mark multiple notifications as read
    async markNotificationsAsRead(notificationIds, userId) {
        try {
            const result = await Notification.updateMany(
                {
                    _id: { $in: notificationIds },
                    recipient: userId,
                    isRead: false
                },
                {
                    isRead: true,
                    readAt: new Date()
                }
            );

            return result.modifiedCount;
        } catch (error) {
            console.error('Mark notifications as read error:', error);
            throw new Error('Failed to mark notifications as read');
        }
    }

    // Get notification statistics
    async getNotificationStats(days = 30) {
        try {
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

            const stats = await Notification.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            category: '$category',
                            type: '$type',
                            isRead: '$isRead'
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalNotifications = await Notification.countDocuments({
                createdAt: { $gte: startDate }
            });

            const unreadCount = await Notification.countDocuments({
                createdAt: { $gte: startDate },
                isRead: false
            });

            return {
                period: { startDate, endDate: new Date(), days },
                totalNotifications,
                unreadCount,
                readCount: totalNotifications - unreadCount,
                categoryBreakdown: stats
            };
        } catch (error) {
            console.error('Get notification stats error:', error);
            throw new Error('Failed to get notification statistics');
        }
    }

    // Private method for channel delivery (would be implemented with actual services)
    async deliverThroughChannels(userId, notification) {
        try {
            // Get user preferences
            const user = await User.findById(userId).select('notificationPreferences');
            const preferences = user?.notificationPreferences || {
                email: true,
                push: true,
                in_app: true
            };

            // In-app notification (always delivered)
            console.log(`📱 In-app notification delivered to user ${userId}: ${notification.title}`);

            // Email notification
            if (preferences.email) {
                await this.sendEmailNotification(userId, notification);
            }

            // Push notification
            if (preferences.push) {
                await this.sendPushNotification(userId, notification);
            }

        } catch (error) {
            console.error('Channel delivery error:', error);
            // Don't throw error here to avoid failing the main notification
        }
    }

    async sendEmailNotification(userId, notification) {
        // Integration with email service (Nodemailer, SendGrid, etc.)
        console.log(`📧 Email notification queued for user ${userId}: ${notification.title}`);
        // Implementation would go here
    }

    async sendPushNotification(userId, notification) {
        // Integration with push notification service (Firebase Cloud Messaging, etc.)
        console.log(`🔔 Push notification queued for user ${userId}: ${notification.title}`);
        // Implementation would go here
    }
}

module.exports = new NotificationService();