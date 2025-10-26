const mongoose = require('mongoose');
const { DEVICE_STATUS } = require('../config/constants');

/**
 * Manager Model - Extends User model with manager-specific data
 */
const managerSchema = new mongoose.Schema({
    managerId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    godown: {
        name: {
            type: String,
            required: [true, 'Godown name is required'],
            trim: true,
            maxlength: [100, 'Godown name cannot exceed 100 characters']
        },
        location: {
            address: {
                type: String,
                required: [true, 'Address is required']
            },
            city: String,
            state: String,
            pincode: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            }
        },
        totalCapacity: {
            type: Number,
            required: [true, 'Total capacity is required'],
            min: [1, 'Capacity must be at least 1 unit']
        },
        availableCapacity: {
            type: Number,
            default: function() {
                return this.godown.totalCapacity;
            }
        },
        description: String
    },
    zillowDevice: {
        deviceId: {
            type: String,
            unique: true,
            sparse: true // Allows null values without violating unique constraint
        },
        status: {
            type: String,
            enum: Object.values(DEVICE_STATUS),
            default: DEVICE_STATUS.OFFLINE
        },
        lastActive: Date,
        installationDate: Date
    },
    contact: {
        phone: String,
        alternatePhone: String,
        address: String
    },
    isActive: {
        type: Boolean,
        default: true
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
managerSchema.index({ managerId: 1 });
managerSchema.index({ 'zillowDevice.deviceId': 1 });
managerSchema.index({ 'godown.location.city': 1 });

// Update timestamp
managerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for used capacity
managerSchema.virtual('usedCapacity').get(function() {
    return this.godown.totalCapacity - this.godown.availableCapacity;
});

// Virtual for capacity percentage
managerSchema.virtual('capacityPercentage').get(function() {
    return ((this.usedCapacity / this.godown.totalCapacity) * 100).toFixed(2);
});

// Method to check if capacity is available
managerSchema.methods.hasCapacity = function(requiredCapacity) {
    return this.godown.availableCapacity >= requiredCapacity;
};

// Method to allocate capacity
managerSchema.methods.allocateCapacity = function(capacity) {
    if (!this.hasCapacity(capacity)) {
        throw new Error('Insufficient capacity');
    }
    this.godown.availableCapacity -= capacity;
    return this.save();
};

// Method to release capacity
managerSchema.methods.releaseCapacity = function(capacity) {
    this.godown.availableCapacity += capacity;
    // Ensure we don't exceed total capacity
    if (this.godown.availableCapacity > this.godown.totalCapacity) {
        this.godown.availableCapacity = this.godown.totalCapacity;
    }
    return this.save();
};

// Static method to find by device ID
managerSchema.statics.findByDeviceId = function(deviceId) {
    return this.findOne({ 'zillowDevice.deviceId': deviceId }).populate('userId');
};

module.exports = mongoose.model('Manager', managerSchema);