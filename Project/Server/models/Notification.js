const mongoose = require('mongoose');

/**
 * Notification Model - Manages system notifications and messages
 */
const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Notification title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Notification message is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success', 'alert'],
        default: 'info'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        enum: ['system', 'storage', 'device', 'security', 'user', 'other'],
        default: 'system'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    actionRequired: {
        type: Boolean,
        default: false
    },
    actionUrl: String, // URL for frontend action
    actionLabel: String,
    metadata: mongoose.Schema.Types.Mixed,
    expiresAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Update timestamp
notificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for isExpired
notificationSchema.virtual('isExpired').get(function() {
    return this.expiresAt && new Date() > this.expiresAt;
});

// Instance method to mark as read
notificationSchema.methods.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Static method to create system notification
notificationSchema.statics.createSystemNotification = function(recipientId, title, message, options = {}) {
    return this.create({
        title,
        message,
        recipient: recipientId,
        type: options.type || 'info',
        category: 'system',
        priority: options.priority || 'normal',
        actionRequired: options.actionRequired || false,
        actionUrl: options.actionUrl,
        actionLabel: options.actionLabel,
        metadata: options.metadata,
        expiresAt: options.expiresAt
    });
};

// Static method to create storage notification
notificationSchema.statics.createStorageNotification = function(recipientId, storage, action, options = {}) {
    const title = `Storage ${action}`;
    const message = `Your storage request for ${storage.quantity}kg of ${storage.grainType} has been ${action}.`;
    
    return this.create({
        title,
        message,
        recipient: recipientId,
        type: action === 'approved' ? 'success' : 'warning',
        category: 'storage',
        priority: 'normal',
        actionRequired: false,
        metadata: { storageId: storage.storageId, action }
    });
};

// Static method to create device alert
notificationSchema.statics.createDeviceAlert = function(recipientId, deviceId, alert, options = {}) {
    const title = `Device Alert: ${alert.type}`;
    const message = `Device ${deviceId}: ${alert.message}`;
    
    return this.create({
        title,
        message,
        recipient: recipientId,
        type: 'alert',
        category: 'device',
        priority: 'high',
        actionRequired: true,
        actionUrl: `/devices/${deviceId}`,
        actionLabel: 'View Device',
        metadata: { deviceId, alert }
    });
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({
        recipient: userId,
        isRead: false,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: { $gt: new Date() } }
        ]
    });
};

// Static method to get notifications for user
notificationSchema.statics.getUserNotifications = function(userId, limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    
    return this.find({
        recipient: userId,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: { $gt: new Date() } }
        ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'username profile')
    .lean();
};

module.exports = mongoose.model('Notification', notificationSchema);