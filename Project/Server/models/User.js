const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

/**
 * User Model - Handles all user accounts (Admin, Manager, User)
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.USER
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    profile: {
        firstName: {
            type: String,
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters']
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
        }
    },
    lastLogin: Date,
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

// Indexes for performance
userSchema.index({ role: 1, isApproved: 1 });
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Middleware to update updatedAt timestamp
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user info (exclude password)
userSchema.methods.getUserInfo = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        isApproved: this.isApproved,
        profile: this.profile,
        lastLogin: this.lastLogin,
        createdAt: this.createdAt
    };
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
    return this.find({ role, isActive: true });
};

module.exports = mongoose.model('User', userSchema);