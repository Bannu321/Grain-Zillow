const mongoose = require('mongoose');
const { IOT_COMMANDS } = require('../config/constants');

/**
 * DeviceControl Model - Manages IoT device command queue
 */
const deviceControlSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: [true, 'Device ID is required'],
        index: true
    },
    command: {
        type: String,
        required: [true, 'Command is required'],
        enum: Object.values(IOT_COMMANDS)
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'executed', 'failed', 'cancelled'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'critical'],
        default: 'normal'
    },
    scheduledFor: {
        type: Date,
        default: Date.now
    },
    executedAt: Date,
    response: {
        receivedAt: Date,
        message: String,
        data: mongoose.Schema.Types.Mixed
    },
    metadata: {
        duration: Number, // Expected execution duration in ms
        retryCount: {
            type: Number,
            default: 0
        },
        maxRetries: {
            type: Number,
            default: 3
        },
        error: String
    },
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
deviceControlSchema.index({ deviceId: 1, status: 1 });
deviceControlSchema.index({ status: 1, scheduledFor: 1 });
deviceControlSchema.index({ issuedBy: 1, createdAt: -1 });
deviceControlSchema.index({ createdAt: -1 });

// Update timestamp
deviceControlSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual to check if command is executable
deviceControlSchema.virtual('isExecutable').get(function() {
    return this.status === 'pending' && new Date() >= this.scheduledFor;
});

// Virtual to check if command can be retried
deviceControlSchema.virtual('canRetry').get(function() {
    return this.status === 'failed' && 
           this.metadata.retryCount < this.metadata.maxRetries;
});

// Instance method to mark as executed
deviceControlSchema.methods.markExecuted = function(response = {}) {
    this.status = 'executed';
    this.executedAt = new Date();
    this.response = {
        receivedAt: new Date(),
        ...response
    };
    return this.save();
};

// Instance method to mark as failed
deviceControlSchema.methods.markFailed = function(error) {
    this.status = 'failed';
    this.metadata.retryCount += 1;
    this.metadata.error = error.message || error;
    return this.save();
};

// Instance method to retry command
deviceControlSchema.methods.retry = function() {
    if (!this.canRetry) {
        throw new Error('Max retries exceeded or command not failed');
    }
    this.status = 'pending';
    this.scheduledFor = new Date();
    return this.save();
};

// Static method to get pending commands for device
deviceControlSchema.statics.getPendingCommands = function(deviceId, limit = 10) {
    return this.find({
        deviceId,
        status: 'pending',
        scheduledFor: { $lte: new Date() }
    })
    .sort({ priority: -1, createdAt: 1 })
    .limit(limit)
    .populate('issuedBy', 'username role');
};

// Static method to get command history
deviceControlSchema.statics.getCommandHistory = function(deviceId, days = 7) {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    
    return this.find({
        deviceId,
        createdAt: { $gte: startDate }
    })
    .sort({ createdAt: -1 })
    .populate('issuedBy', 'username role');
};

// Static method to cancel pending commands
deviceControlSchema.statics.cancelPendingCommands = function(deviceId, commandType = null) {
    const query = {
        deviceId,
        status: 'pending'
    };
    
    if (commandType) {
        query.command = commandType;
    }
    
    return this.updateMany(query, { 
        status: 'cancelled',
        updatedAt: new Date()
    });
};

module.exports = mongoose.model('DeviceControl', deviceControlSchema);