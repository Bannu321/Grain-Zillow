const mongoose = require('mongoose');
const { DEVICE_STATUS } = require('../config/constants');

/**
 * Device Model - Manages ESP32 device information and configuration
 */
const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: [true, 'Device ID is required'],
        unique: true,
        uppercase: true,
        match: [/^ZILLOW_[A-Z0-9]+$/, 'Device ID must start with ZILLOW_']
    },
    name: {
        type: String,
        required: [true, 'Device name is required'],
        trim: true,
        maxlength: [100, 'Device name cannot exceed 100 characters']
    },
    managerId: {
        type: String,
        required: [true, 'Manager ID is required'],
        ref: 'Manager'
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    status: {
        type: String,
        enum: Object.values(DEVICE_STATUS),
        default: DEVICE_STATUS.OFFLINE
    },
    configuration: {
        temperatureThreshold: {
            min: { type: Number, default: 10 },
            max: { type: Number, default: 40 }
        },
        humidityThreshold: {
            min: { type: Number, default: 30 },
            max: { type: Number, default: 70 }
        },
        gasThreshold: {
            max: { type: Number, default: 1000 }
        },
        samplingInterval: { // in seconds
            type: Number,
            default: 300
        },
        autoControl: {
            fan: { type: Boolean, default: false },
            pump: { type: Boolean, default: false },
            buzzer: { type: Boolean, default: true }
        }
    },
    lastSeen: Date,
    firmwareVersion: String,
    ipAddress: String,
    metadata: {
        type: Map,
        of: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ managerId: 1 });
deviceSchema.index({ status: 1 });
deviceSchema.index({ lastSeen: -1 });
deviceSchema.index({ 'configuration.autoControl.fan': 1 });

// Update timestamp
deviceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for device online status
deviceSchema.virtual('isOnline').get(function() {
    return this.status === DEVICE_STATUS.ONLINE;
});

// Virtual for device needing maintenance
deviceSchema.virtual('needsMaintenance').get(function() {
    return this.status === DEVICE_STATUS.MAINTENANCE;
});

// Method to update last seen timestamp
deviceSchema.methods.updateLastSeen = function() {
    this.lastSeen = new Date();
    this.status = DEVICE_STATUS.ONLINE;
    return this.save();
};

// Method to set device offline
deviceSchema.methods.setOffline = function() {
    this.status = DEVICE_STATUS.OFFLINE;
    return this.save();
};

// Method to update configuration
deviceSchema.methods.updateConfiguration = function(newConfig) {
    this.configuration = { ...this.configuration, ...newConfig };
    return this.save();
};

// Static method to find devices by manager
deviceSchema.statics.findByManager = function(managerId) {
    return this.find({ managerId, isActive: true })
        .sort({ name: 1 });
};

// Static method to find online devices
deviceSchema.statics.findOnlineDevices = function() {
    return this.find({ 
        status: DEVICE_STATUS.ONLINE,
        isActive: true 
    });
};

// Static method to find devices needing maintenance
deviceSchema.statics.findDevicesNeedingMaintenance = function() {
    return this.find({ 
        status: DEVICE_STATUS.MAINTENANCE,
        isActive: true 
    });
};

// Static method to get device statistics
deviceSchema.statics.getDeviceStats = async function() {
    const stats = await this.aggregate([
        {
            $match: { isActive: true }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
    
    const total = await this.countDocuments({ isActive: true });
    const online = stats.find(s => s._id === DEVICE_STATUS.ONLINE)?.count || 0;
    const offline = stats.find(s => s._id === DEVICE_STATUS.OFFLINE)?.count || 0;
    const maintenance = stats.find(s => s._id === DEVICE_STATUS.MAINTENANCE)?.count || 0;
    
    return {
        total,
        online,
        offline,
        maintenance,
        onlinePercentage: total > 0 ? ((online / total) * 100).toFixed(2) : 0
    };
};

module.exports = mongoose.model('Device', deviceSchema);