const User = require('../models/User');
const Manager = require('../models/Manager');
const Notification = require('../models/Notification');
const { ROLES } = require('../config/constants');

/**
 * User Management Controller
 * Handles user operations, approvals, and role management
 */

exports.getPendingApprovals = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const users = await User.find({
            isApproved: false,
            isActive: true,
            role: ROLES.USER
        })
        .select('username email profile createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        const total = await User.countDocuments({
            isApproved: false,
            isActive: true,
            role: ROLES.USER
        });

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get pending approvals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending approvals',
            error: error.message
        });
    }
};

exports.approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'User is already approved'
            });
        }

        user.isApproved = true;
        await user.save();

        // Notify user about approval
        await Notification.create({
            title: 'Account Approved',
            message: 'Your account has been approved. You can now access all features.',
            type: 'success',
            recipient: user._id,
            category: 'user',
            priority: 'normal'
        });

        res.json({
            success: true,
            message: 'User approved successfully',
            data: {
                user: user.getUserInfo()
            }
        });
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving user',
            error: error.message
        });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Notify user about rejection
        await Notification.create({
            title: 'Account Registration Rejected',
            message: `Your account registration has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
            type: 'error',
            recipient: user._id,
            category: 'user',
            priority: 'normal'
        });

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: 'User registration rejected and account deleted'
        });
    } catch (error) {
        console.error('Reject user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting user',
            error: error.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        const skip = (page - 1) * limit;

        let query = { isActive: true };
        
        if (role) {
            query.role = role;
        }
        
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'profile.firstName': { $regex: search, $options: 'i' } },
                { 'profile.lastName': { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('username email role isApproved profile lastLogin createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: user.getUserInfo()
            }
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!Object.values(ROLES).includes(role)) {
            return res.status(400).json({
                success: false,
                message: `Invalid role. Must be one of: ${Object.values(ROLES).join(', ')}`
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const oldRole = user.role;
        user.role = role;
        
        // If promoting to manager, ensure they're approved
        if (role === ROLES.MANAGER) {
            user.isApproved = true;
        }

        await user.save();

        // Notify user about role change
        await Notification.create({
            title: 'Role Updated',
            message: `Your role has been changed from ${oldRole} to ${role}.`,
            type: 'info',
            recipient: user._id,
            category: 'user',
            priority: 'normal'
        });

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: {
                user: user.getUserInfo()
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role',
            error: error.message
        });
    }
};

exports.deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isActive = false;
        await user.save();

        // If user is a manager, also deactivate their manager profile
        if (user.role === ROLES.MANAGER) {
            await Manager.findOneAndUpdate(
                { userId: user._id },
                { isActive: false }
            );
        }

        res.json({
            success: true,
            message: 'User deactivated successfully'
        });
    } catch (error) {
        console.error('Deactivate user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deactivating user',
            error: error.message
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password');
        
        res.json({
            success: true,
            data: {
                user: user.getUserInfo()
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { profile } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profile },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: user.getUserInfo()
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const stats = await User.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                    approved: {
                        $sum: { $cond: ['$isApproved', 1, 0] }
                    }
                }
            }
        ]);

        const totalUsers = await User.countDocuments({ isActive: true });
        const pendingApprovals = await User.countDocuments({
            isApproved: false,
            isActive: true,
            role: ROLES.USER
        });

        const roleStats = {};
        stats.forEach(stat => {
            roleStats[stat._id] = {
                total: stat.count,
                approved: stat.approved,
                pending: stat.count - stat.approved
            };
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                pendingApprovals,
                roles: roleStats
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message
        });
    }
};