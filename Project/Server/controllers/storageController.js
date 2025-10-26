const Storage = require('../models/Storage');
const Manager = require('../models/Manager');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { generateUniqueId } = require('../utils/helpers');
const { STORAGE_STATUS, ROLES } = require('../config/constants');

/**
 * Storage Management Controller
 * Handles grain storage requests, approvals, and management
 */

exports.requestStorage = async (req, res) => {
    try {
        const { managerId, grainType, quantity, capacity, duration, notes } = req.body;
        
        // Check manager exists and is active
        const manager = await Manager.findOne({ managerId, isActive: true });
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found or inactive'
            });
        }

        // Check if manager has sufficient capacity
        if (!manager.hasCapacity(capacity)) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient storage capacity available'
            });
        }

        // Generate unique storage ID
        const storageId = await generateUniqueId('STR');
        
        const storageRequest = await Storage.create({
            storageId,
            userId: req.user.id,
            managerId,
            grainType,
            quantity,
            capacity,
            duration,
            notes,
            status: STORAGE_STATUS.PENDING
        });

        // Notify manager about new storage request
        await Notification.create({
            title: 'New Storage Request',
            message: `New storage request for ${quantity}kg of ${grainType} from ${req.user.username}.`,
            type: 'info',
            recipient: manager.userId,
            category: 'storage',
            priority: 'normal',
            actionRequired: true,
            actionUrl: `/manager/storage/pending`,
            actionLabel: 'Review Request',
            metadata: { storageId: storageRequest.storageId }
        });

        res.status(201).json({
            success: true,
            message: 'Storage request submitted successfully',
            data: {
                storage: storageRequest
            }
        });
    } catch (error) {
        console.error('Request storage error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating storage request',
            error: error.message
        });
    }
};

exports.getUserStorage = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let query = { userId: req.user.id };
        if (status) {
            query.status = status;
        }

        const storages = await Storage.find(query)
            .populate('managerId', 'godown.name contact')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Storage.countDocuments(query);

        res.json({
            success: true,
            data: {
                storages,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get user storage error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user storage',
            error: error.message
        });
    }
};

exports.getUserStorageStats = async (req, res) => {
    try {
        const stats = await Storage.aggregate([
            {
                $match: { userId: req.user._id }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalCapacity: { $sum: '$capacity' }
                }
            }
        ]);

        const totalStorages = await Storage.countDocuments({ userId: req.user._id });
        const activeStorages = await Storage.countDocuments({ 
            userId: req.user._id, 
            status: { $in: [STORAGE_STATUS.APPROVED, STORAGE_STATUS.ACTIVE] } 
        });

        const statusStats = {};
        stats.forEach(stat => {
            statusStats[stat._id] = {
                count: stat.count,
                totalQuantity: stat.totalQuantity,
                totalCapacity: stat.totalCapacity
            };
        });

        res.json({
            success: true,
            data: {
                totalStorages,
                activeStorages,
                statusStats
            }
        });
    } catch (error) {
        console.error('Get user storage stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching storage statistics',
            error: error.message
        });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager profile not found'
            });
        }

        const pendingRequests = await Storage.find({
            managerId: manager.managerId,
            status: STORAGE_STATUS.PENDING
        })
        .populate('userId', 'username email profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        const total = await Storage.countDocuments({
            managerId: manager.managerId,
            status: STORAGE_STATUS.PENDING
        });

        res.json({
            success: true,
            data: {
                pendingRequests,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get pending requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending requests',
            error: error.message
        });
    }
};

exports.approveStorage = async (req, res) => {
    try {
        const { storageId } = req.params;
        const { notes } = req.body;

        const storage = await Storage.findOne({ storageId });
        if (!storage) {
            return res.status(404).json({
                success: false,
                message: 'Storage request not found'
            });
        }

        // Verify the manager owns this storage
        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager || storage.managerId !== manager.managerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to approve this storage'
            });
        }

        if (storage.status !== STORAGE_STATUS.PENDING) {
            return res.status(400).json({
                success: false,
                message: 'Storage request is not in pending status'
            });
        }

        // Check capacity again
        if (!manager.hasCapacity(storage.capacity)) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient capacity to approve this request'
            });
        }

        // Allocate capacity
        await manager.allocateCapacity(storage.capacity);

        // Update storage status
        await storage.approveStorage();
        if (notes) {
            storage.notes = notes;
            await storage.save();
        }

        // Notify user about approval
        await Notification.createStorageNotification(
            storage.userId,
            storage,
            'approved'
        );

        res.json({
            success: true,
            message: 'Storage request approved successfully',
            data: {
                storage
            }
        });
    } catch (error) {
        console.error('Approve storage error:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving storage request',
            error: error.message
        });
    }
};

exports.rejectStorage = async (req, res) => {
    try {
        const { storageId } = req.params;
        const { reason } = req.body;

        const storage = await Storage.findOne({ storageId });
        if (!storage) {
            return res.status(404).json({
                success: false,
                message: 'Storage request not found'
            });
        }

        // Verify the manager owns this storage
        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager || storage.managerId !== manager.managerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this storage'
            });
        }

        storage.status = STORAGE_STATUS.REJECTED;
        if (reason) {
            storage.notes = reason;
        }
        await storage.save();

        // Notify user about rejection
        await Notification.createStorageNotification(
            storage.userId,
            storage,
            'rejected'
        );

        res.json({
            success: true,
            message: 'Storage request rejected successfully',
            data: {
                storage
            }
        });
    } catch (error) {
        console.error('Reject storage error:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting storage request',
            error: error.message
        });
    }
};

exports.completeStorage = async (req, res) => {
    try {
        const { storageId } = req.params;

        const storage = await Storage.findOne({ storageId });
        if (!storage) {
            return res.status(404).json({
                success: false,
                message: 'Storage not found'
            });
        }

        // Verify the manager owns this storage
        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager || storage.managerId !== manager.managerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to complete this storage'
            });
        }

        if (storage.status !== STORAGE_STATUS.ACTIVE) {
            return res.status(400).json({
                success: false,
                message: 'Only active storage can be completed'
            });
        }

        // Release capacity
        await manager.releaseCapacity(storage.capacity);

        // Mark storage as completed
        await storage.completeStorage();

        // Notify user about completion
        await Notification.createStorageNotification(
            storage.userId,
            storage,
            'completed'
        );

        res.json({
            success: true,
            message: 'Storage completed successfully',
            data: {
                storage
            }
        });
    } catch (error) {
        console.error('Complete storage error:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing storage',
            error: error.message
        });
    }
};

exports.cancelStorageRequest = async (req, res) => {
    try {
        const { storageId } = req.params;

        const storage = await Storage.findOne({ storageId });
        if (!storage) {
            return res.status(404).json({
                success: false,
                message: 'Storage request not found'
            });
        }

        // Verify the user owns this storage request
        if (storage.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this storage request'
            });
        }

        if (storage.status !== STORAGE_STATUS.PENDING) {
            return res.status(400).json({
                success: false,
                message: 'Only pending storage requests can be cancelled'
            });
        }

        await Storage.findByIdAndDelete(storage._id);

        res.json({
            success: true,
            message: 'Storage request cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel storage request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling storage request',
            error: error.message
        });
    }
};

exports.getManagerStorage = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager profile not found'
            });
        }

        let query = { managerId: manager.managerId };
        if (status) {
            query.status = status;
        }

        const storages = await Storage.find(query)
            .populate('userId', 'username email profile')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Storage.countDocuments(query);

        res.json({
            success: true,
            data: {
                storages,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get manager storage error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching manager storage',
            error: error.message
        });
    }
};

exports.getStorageById = async (req, res) => {
    try {
        const { storageId } = req.params;

        const storage = await Storage.findOne({ storageId })
            .populate('userId', 'username email profile')
            .populate('managerId', 'godown.name contact');

        if (!storage) {
            return res.status(404).json({
                success: false,
                message: 'Storage not found'
            });
        }

        // Check authorization
        if (req.user.role === ROLES.USER && storage.userId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this storage'
            });
        }

        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (!manager || storage.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to view this storage'
                });
            }
        }

        res.json({
            success: true,
            data: {
                storage
            }
        });
    } catch (error) {
        console.error('Get storage by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching storage',
            error: error.message
        });
    }
};

exports.updateQualityMetrics = async (req, res) => {
    try {
        const { storageId } = req.params;
        const { qualityMetrics } = req.body;

        const storage = await Storage.findOne({ storageId });
        if (!storage) {
            return res.status(404).json({
                success: false,
                message: 'Storage not found'
            });
        }

        // Verify the manager owns this storage
        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager || storage.managerId !== manager.managerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update quality metrics'
            });
        }

        storage.qualityMetrics = {
            ...storage.qualityMetrics,
            ...qualityMetrics,
            lastChecked: new Date()
        };
        await storage.save();

        res.json({
            success: true,
            message: 'Quality metrics updated successfully',
            data: {
                storage
            }
        });
    } catch (error) {
        console.error('Update quality metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating quality metrics',
            error: error.message
        });
    }
};

exports.getAllStorage = async (req, res) => {
    try {
        const { status, grainType, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) query.status = status;
        if (grainType) query.grainType = grainType;

        const storages = await Storage.find(query)
            .populate('userId', 'username email')
            .populate('managerId', 'godown.name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Storage.countDocuments(query);

        res.json({
            success: true,
            data: {
                storages,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all storage error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching all storage',
            error: error.message
        });
    }
};

exports.getStorageStats = async (req, res) => {
    try {
        const stats = await Storage.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalCapacity: { $sum: '$capacity' }
                }
            }
        ]);

        const grainStats = await Storage.aggregate([
            {
                $group: {
                    _id: '$grainType',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalCapacity: { $sum: '$capacity' }
                }
            }
        ]);

        const totalStorages = await Storage.countDocuments();
        const activeStorages = await Storage.countDocuments({ 
            status: { $in: [STORAGE_STATUS.APPROVED, STORAGE_STATUS.ACTIVE] } 
        });

        const statusStats = {};
        stats.forEach(stat => {
            statusStats[stat._id] = {
                count: stat.count,
                totalQuantity: stat.totalQuantity,
                totalCapacity: stat.totalCapacity
            };
        });

        const grainTypeStats = {};
        grainStats.forEach(stat => {
            grainTypeStats[stat._id] = {
                count: stat.count,
                totalQuantity: stat.totalQuantity,
                totalCapacity: stat.totalCapacity
            };
        });

        res.json({
            success: true,
            data: {
                totalStorages,
                activeStorages,
                statusStats,
                grainTypeStats
            }
        });
    } catch (error) {
        console.error('Get storage stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching storage statistics',
            error: error.message
        });
    }
};