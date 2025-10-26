const Manager = require('../models/Manager');
const User = require('../models/User');
const Device = require('../models/Device');
const Storage = require('../models/Storage');
const { generateUniqueId } = require('../utils/helpers');
const { ROLES } = require('../config/constants');

/**
 * Manager Management Controller
 * Handles manager operations, godown management, and Zillow device assignment
 */

exports.createManager = async (req, res) => {
    try {
        const { userId, godown, contact } = req.body;
        
        // Check if user exists and is approved
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'User must be approved before becoming a manager'
            });
        }

        // Check if user is already a manager
        const existingManager = await Manager.findOne({ userId });
        if (existingManager) {
            return res.status(400).json({
                success: false,
                message: 'User is already a manager'
            });
        }

        // Generate unique manager ID
        const managerId = await generateUniqueId('MGR');

        // Create manager
        const manager = await Manager.create({
            managerId,
            userId,
            godown: {
                ...godown,
                availableCapacity: godown.totalCapacity
            },
            contact,
            zillowDevice: {
                deviceId: `ZILLOW_${managerId}`,
                status: 'offline'
            }
        });

        // Update user role to manager
        user.role = ROLES.MANAGER;
        await user.save();

        // Create default device for the manager
        await Device.create({
            deviceId: `ZILLOW_${managerId}`,
            name: `${godown.name} - Zillow Device`,
            managerId: manager.managerId,
            location: godown.location.address,
            status: 'offline'
        });

        res.status(201).json({
            success: true,
            message: 'Manager created successfully',
            data: {
                manager: {
                    managerId: manager.managerId,
                    godown: manager.godown,
                    zillowDevice: manager.zillowDevice,
                    contact: manager.contact
                }
            }
        });
    } catch (error) {
        console.error('Create manager error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating manager',
            error: error.message
        });
    }
};

exports.getAllManagers = async (req, res) => {
    try {
        const { page = 1, limit = 10, active } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (active !== undefined) {
            query.isActive = active === 'true';
        }

        const managers = await Manager.find(query)
            .populate('userId', 'username email profile')
            .select('managerId godown zillowDevice contact isActive createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Manager.countDocuments(query);

        // Get device status for each manager
        const managersWithStatus = await Promise.all(
            managers.map(async (manager) => {
                const device = await Device.findOne({ deviceId: manager.zillowDevice.deviceId })
                    .select('status lastSeen');
                return {
                    ...manager.toObject(),
                    zillowDevice: {
                        ...manager.zillowDevice.toObject(),
                        status: device?.status || 'offline',
                        lastSeen: device?.lastSeen
                    }
                };
            })
        );

        res.json({
            success: true,
            data: {
                managers: managersWithStatus,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all managers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching managers',
            error: error.message
        });
    }
};

exports.getManagerZillowStatus = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const manager = await Manager.findOne({ managerId })
            .populate('userId', 'username profile')
            .select('managerId zillowDevice godown');

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found'
            });
        }

        // Get device details and latest sensor data
        const device = await Device.findOne({ deviceId: manager.zillowDevice.deviceId });
        const SensorData = require('../models/SensorData');
        const latestData = await SensorData.findOne({ deviceId: manager.zillowDevice.deviceId })
            .sort({ timestamp: -1 })
            .select('temperature humidity gasLevel timestamp');

        res.json({
            success: true,
            data: {
                managerId: manager.managerId,
                managerName: manager.userId.username,
                godownName: manager.godown.name,
                zillowStatus: device?.status || 'offline',
                lastActive: device?.lastSeen,
                capacity: {
                    total: manager.godown.totalCapacity,
                    available: manager.godown.availableCapacity,
                    used: manager.godown.totalCapacity - manager.godown.availableCapacity
                },
                latestData: latestData || null
            }
        });
    } catch (error) {
        console.error('Get manager Zillow status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching Zillow status',
            error: error.message
        });
    }
};

exports.getMyGodown = async (req, res) => {
    try {
        const manager = await Manager.findOne({ userId: req.user.id })
            .populate('userId', 'username email')
            .select('managerId godown zillowDevice contact');

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager profile not found'
            });
        }

        // Get storage statistics
        const activeStorage = await Storage.countDocuments({
            managerId: manager.managerId,
            status: { $in: ['approved', 'active'] }
        });

        const pendingRequests = await Storage.countDocuments({
            managerId: manager.managerId,
            status: 'pending'
        });

        res.json({
            success: true,
            data: {
                manager: manager,
                statistics: {
                    activeStorage,
                    pendingRequests,
                    capacity: {
                        total: manager.godown.totalCapacity,
                        available: manager.godown.availableCapacity,
                        used: manager.godown.totalCapacity - manager.godown.availableCapacity,
                        usagePercentage: ((manager.godown.totalCapacity - manager.godown.availableCapacity) / manager.godown.totalCapacity * 100).toFixed(2)
                    }
                }
            }
        });
    } catch (error) {
        console.error('Get my godown error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching godown information',
            error: error.message
        });
    }
};

exports.updateMyGodown = async (req, res) => {
    try {
        const { godown, contact } = req.body;

        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager profile not found'
            });
        }

        // Update godown information
        if (godown) {
            // If updating capacity, adjust available capacity accordingly
            if (godown.totalCapacity && godown.totalCapacity !== manager.godown.totalCapacity) {
                const capacityDiff = godown.totalCapacity - manager.godown.totalCapacity;
                manager.godown.availableCapacity += capacityDiff;
                
                // Ensure available capacity doesn't go negative
                if (manager.godown.availableCapacity < 0) {
                    manager.godown.availableCapacity = 0;
                }
                
                manager.godown.totalCapacity = godown.totalCapacity;
            }

            // Update other godown fields
            if (godown.name) manager.godown.name = godown.name;
            if (godown.location) manager.godown.location = { ...manager.godown.location, ...godown.location };
            if (godown.description !== undefined) manager.godown.description = godown.description;
        }

        if (contact) {
            manager.contact = { ...manager.contact, ...contact };
        }

        await manager.save();

        res.json({
            success: true,
            message: 'Godown information updated successfully',
            data: {
                manager: {
                    managerId: manager.managerId,
                    godown: manager.godown,
                    contact: manager.contact
                }
            }
        });
    } catch (error) {
        console.error('Update my godown error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating godown information',
            error: error.message
        });
    }
};

exports.getMyStorageRequests = async (req, res) => {
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

        const storageRequests = await Storage.find(query)
            .populate('userId', 'username email profile')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Storage.countDocuments(query);

        res.json({
            success: true,
            data: {
                storageRequests,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get my storage requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching storage requests',
            error: error.message
        });
    }
};

exports.getStorageCapacity = async (req, res) => {
    try {
        const { managerId } = req.params;

        const manager = await Manager.findOne({ managerId });
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found'
            });
        }

        // Calculate used capacity from active storage
        const usedCapacity = await Storage.getUsedCapacity(managerId);

        res.json({
            success: true,
            data: {
                managerId: manager.managerId,
                godownName: manager.godown.name,
                capacity: {
                    total: manager.godown.totalCapacity,
                    available: manager.godown.availableCapacity,
                    used: usedCapacity,
                    usagePercentage: ((usedCapacity / manager.godown.totalCapacity) * 100).toFixed(2)
                }
            }
        });
    } catch (error) {
        console.error('Get storage capacity error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching storage capacity',
            error: error.message
        });
    }
};

exports.getManagerStats = async (req, res) => {
    try {
        const totalManagers = await Manager.countDocuments({ isActive: true });
        const totalGodownCapacity = await Manager.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalCapacity: { $sum: '$godown.totalCapacity' },
                    availableCapacity: { $sum: '$godown.availableCapacity' }
                }
            }
        ]);

        const deviceStats = await Device.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const capacityStats = totalGodownCapacity[0] || { totalCapacity: 0, availableCapacity: 0 };

        res.json({
            success: true,
            data: {
                totalManagers,
                capacity: {
                    total: capacityStats.totalCapacity,
                    available: capacityStats.availableCapacity,
                    used: capacityStats.totalCapacity - capacityStats.availableCapacity,
                    usagePercentage: capacityStats.totalCapacity > 0 ? 
                        ((capacityStats.totalCapacity - capacityStats.availableCapacity) / capacityStats.totalCapacity * 100).toFixed(2) : 0
                },
                devices: deviceStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Get manager stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching manager statistics',
            error: error.message
        });
    }
};

exports.getManagerById = async (req, res) => {
    try {
        const { managerId } = req.params;

        const manager = await Manager.findOne({ managerId })
            .populate('userId', 'username email profile')
            .select('-__v');

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found'
            });
        }

        res.json({
            success: true,
            data: {
                manager
            }
        });
    } catch (error) {
        console.error('Get manager by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching manager',
            error: error.message
        });
    }
};