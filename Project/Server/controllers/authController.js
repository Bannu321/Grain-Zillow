const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { JWT_SECRET, JWT_EXPIRES_IN, ROLES } = require('../config/constants');
require('dotenv').config();

/**
 * Authentication Controller
 * Handles user authentication, registration, and token management
 */

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { 
        expiresIn: JWT_EXPIRES_IN 
    });
};

// Send response with token
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            data: {
                user: user.getUserInfo()
            }
        });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, profile } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            profile,
            role: ROLES.USER,
            isApproved: false
        });

        // Notify admins about new registration
        const admins = await User.find({ role: ROLES.ADMIN });
        for (const admin of admins) {
            await Notification.create({
                title: 'New User Registration',
                message: `New user ${username} has registered and is waiting for approval.`,
                type: 'info',
                recipient: admin._id,
                category: 'user',
                priority: 'normal',
                actionRequired: true,
                actionUrl: `/admin/users/pending`,
                actionLabel: 'Review Users'
            });
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Waiting for manager approval.',
            data: {
                user: user.getUserInfo()
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in registration process',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is approved
        if (!user.isApproved && user.role !== ROLES.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Account pending approval from manager'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in login process',
            error: error.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in logout process',
            error: error.message
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Notify user about password change
        await Notification.create({
            title: 'Password Updated',
            message: 'Your password has been updated successfully.',
            type: 'success',
            recipient: user._id,
            category: 'security',
            priority: 'normal'
        });

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.json({
            success: true,
            data: {
                user: user.getUserInfo()
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};