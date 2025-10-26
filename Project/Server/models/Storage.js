const mongoose = require('mongoose');
const { GRAIN_TYPES, STORAGE_STATUS } = require('../config/constants');

/**
 * Storage Model - Manages user storage requests and grain storage
 */
const storageSchema = new mongoose.Schema({
    storageId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    managerId: {
        type: String,
        required: true,
        ref: 'Manager'
    },
    grainType: {
        type: String,
        required: [true, 'Grain type is required'],
        enum: GRAIN_TYPES
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1 kg']
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1 unit']
    },
    status: {
        type: String,
        enum: Object.values(STORAGE_STATUS),
        default: STORAGE_STATUS.PENDING
    },
    duration: {
        startDate: Date,
        endDate: Date,
        plannedDuration: { // In days
            type: Number,
            min: [1, 'Duration must be at least 1 day']
        }
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    qualityMetrics: {
        moistureContent: Number, // Percentage
        foreignMaterial: Number, // Percentage
        temperature: Number,     // Celsius
        lastChecked: Date
    },
    pricing: {
        ratePerUnit: Number,
        totalCost: Number,
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'partial', 'overdue'],
            default: 'pending'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: Date,
    completedAt: Date
});

// Indexes for performance
storageSchema.index({ userId: 1, status: 1 });
storageSchema.index({ managerId: 1, status: 1 });
storageSchema.index({ storageId: 1 });
storageSchema.index({ grainType: 1 });
storageSchema.index({ createdAt: -1 });
storageSchema.index({ status: 1, createdAt: -1 });

// Update timestamp
storageSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Set approvedAt timestamp when status changes to approved
    if (this.isModified('status') && this.status === STORAGE_STATUS.APPROVED && !this.approvedAt) {
        this.approvedAt = new Date();
    }
    
    // Set completedAt timestamp when status changes to completed
    if (this.isModified('status') && this.status === STORAGE_STATUS.COMPLETED && !this.completedAt) {
        this.completedAt = new Date();
    }
    
    next();
});

// Virtual for storage duration in days
storageSchema.virtual('storageDuration').get(function() {
    if (this.duration.startDate && this.duration.endDate) {
        const diffTime = Math.abs(this.duration.endDate - this.duration.startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return this.duration.plannedDuration || 0;
});

// Virtual to check if storage is active
storageSchema.virtual('isActive').get(function() {
    return this.status === STORAGE_STATUS.ACTIVE;
});

// Virtual to check if storage is expired
storageSchema.virtual('isExpired').get(function() {
    if (this.duration.endDate) {
        return new Date() > this.duration.endDate;
    }
    return false;
});

// Instance method to approve storage
storageSchema.methods.approveStorage = function() {
    this.status = STORAGE_STATUS.APPROVED;
    this.duration.startDate = new Date();
    if (this.duration.plannedDuration) {
        const endDate = new Date(this.duration.startDate);
        endDate.setDate(endDate.getDate() + this.duration.plannedDuration);
        this.duration.endDate = endDate;
    }
    return this.save();
};

// Instance method to complete storage
storageSchema.methods.completeStorage = function() {
    this.status = STORAGE_STATUS.COMPLETED;
    this.completedAt = new Date();
    return this.save();
};

// Static method to find active storages by manager
storageSchema.statics.findActiveByManager = function(managerId) {
    return this.find({ 
        managerId, 
        status: { $in: [STORAGE_STATUS.APPROVED, STORAGE_STATUS.ACTIVE] } 
    }).populate('userId', 'username profile');
};

// Static method to find pending requests by manager
storageSchema.statics.findPendingByManager = function(managerId) {
    return this.find({ 
        managerId, 
        status: STORAGE_STATUS.PENDING 
    }).populate('userId', 'username email profile');
};

// Static method to calculate total capacity used by manager
storageSchema.statics.getUsedCapacity = async function(managerId) {
    const result = await this.aggregate([
        {
            $match: { 
                managerId, 
                status: { $in: [STORAGE_STATUS.APPROVED, STORAGE_STATUS.ACTIVE] } 
            }
        },
        {
            $group: {
                _id: null,
                totalCapacity: { $sum: '$capacity' }
            }
        }
    ]);
    
    return result.length > 0 ? result[0].totalCapacity : 0;
};

module.exports = mongoose.model('Storage', storageSchema);