const Device = require('../models/Device');
const Manager = require('../models/Manager');
const SensorData = require('../models/SensorData');
const { DEVICE_STATUS } = require('../config/constants');

/**
 * Device Management Controller
 * Handles ESP32 device registration, status monitoring, and configuration
 */

exports.registerDevice = async (req, res) => {
    try {
        const { deviceId, name, managerId, location, configuration } = req.body;

        // Verify manager exists
        const manager = await Manager.findOne({ managerId });
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found'
            });
        }

        // Check if device already exists
        const existingDevice = await Device.findOne({ deviceId });
        if (existingDevice) {
            return res.status(400).json({
                success: false,
                message: 'Device with this ID already exists'
            });
        }

        // Create device
        const device = await Device.create({
            deviceId,
            name,
            managerId,
            location,
            configuration: configuration || {},
            status: DEVICE_STATUS.OFFLINE
        });

        // Update manager's Zillow device reference
        manager.zillowDevice.deviceId = deviceId;
        await manager.save();

        res.status(201).json({
            success: true,
            message: 'Device registered successfully',
            data: {
                device
            }
        });
    } catch (error) {
        console.error('Register device error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering device',
            error: error.message
        });
    }
};

exports.getAllDevices = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, managerId } = req.query;
        const skip = (page - 1) * limit;

        let query = { isActive: true };
        if (status) query.status = status;
        if (managerId) query.managerId = managerId;

        const devices = await Device.find(query)
            .populate('managerId', 'godown.name')
            .sort({ name: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Device.countDocuments(query);

        // Get latest data for each device
        const devicesWithData = await Promise.all(
            devices.map(async (device) => {
                const latestData = await SensorData.findOne({ deviceId: device.deviceId })
                    .sort({ timestamp: -1 })
                    .select('temperature humidity gasLevel timestamp');
                return {
                    ...device.toObject(),
                    latestData: latestData || null
                };
            })
        );

        res.json({
            success: true,
            data: {
                devices: devicesWithData,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all devices error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching devices',
            error: error.message
        });
    }
};

exports.getMyDevices = async (req, res) => {
    try {
        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager profile not found'
            });
        }

        const devices = await Device.find({ managerId: manager.managerId, isActive: true })
            .sort({ name: 1 });

        const devicesWithData = await Promise.all(
            devices.map(async (device) => {
                const latestData = await SensorData.findOne({ deviceId: device.deviceId })
                    .sort({ timestamp: -1 })
                    .select('temperature humidity gasLevel timestamp status');
                return {
                    ...device.toObject(),
                    latestData: latestData || null
                };
            })
        );

        res.json({
            success: true,
            data: {
                devices: devicesWithData
            }
        });
    } catch (error) {
        console.error('Get my devices error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your devices',
            error: error.message
        });
    }
};

exports.getDeviceById = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOne({ deviceId })
            .populate('managerId', 'godown.name contact');

        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        // Get latest sensor data
        const latestData = await SensorData.findOne({ deviceId })
            .sort({ timestamp: -1 })
            .select('temperature humidity gasLevel timestamp status alerts');

        // Get device statistics
        const stats = await SensorData.getAverages(deviceId, 24);

        res.json({
            success: true,
            data: {
                device,
                latestData: latestData || null,
                statistics: stats
            }
        });
    } catch (error) {
        console.error('Get device by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching device',
            error: error.message
        });
    }
};

exports.updateDeviceStatus = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { status } = req.body;

        if (!Object.values(DEVICE_STATUS).includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${Object.values(DEVICE_STATUS).join(', ')}`
            });
        }

        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        // Verify the device belongs to the manager (if manager is making the request)
        if (req.user.role === 'manager') {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (!manager || device.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this device'
                });
            }
        }

        device.status = status;
        if (status === DEVICE_STATUS.ONLINE) {
            device.lastSeen = new Date();
        }
        await device.save();

        res.json({
            success: true,
            message: `Device status updated to ${status}`,
            data: {
                device
            }
        });
    } catch (error) {
        console.error('Update device status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating device status',
            error: error.message
        });
    }
};

exports.updateDeviceConfiguration = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { configuration } = req.body;

        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        // Verify the device belongs to the manager (if manager is making the request)
        if (req.user.role === 'manager') {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (!manager || device.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this device'
                });
            }
        }

        device.configuration = { ...device.configuration, ...configuration };
        await device.save();

        res.json({
            success: true,
            message: 'Device configuration updated successfully',
            data: {
                device
            }
        });
    } catch (error) {
        console.error('Update device configuration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating device configuration',
            error: error.message
        });
    }
};

exports.setMaintenanceMode = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { maintenance } = req.body;

        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        device.status = maintenance ? DEVICE_STATUS.MAINTENANCE : DEVICE_STATUS.OFFLINE;
        await device.save();

        res.json({
            success: true,
            message: `Device ${maintenance ? 'set to maintenance mode' : 'removed from maintenance mode'}`,
            data: {
                device
            }
        });
    } catch (error) {
        console.error('Set maintenance mode error:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting maintenance mode',
            error: error.message
        });
    }
};

exports.deleteDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        // Verify the device belongs to the manager
        if (req.user.role === 'manager') {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (!manager || device.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this device'
                });
            }
        }

        device.isActive = false;
        await device.save();

        res.json({
            success: true,
            message: 'Device deleted successfully'
        });
    } catch (error) {
        console.error('Delete device error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting device',
            error: error.message
        });
    }
};

exports.getDeviceStats = async (req, res) => {
    try {
        const stats = await Device.getDeviceStats();

        // Get recent alerts
        const recentAlerts = await SensorData.find({
            status: 'critical',
            timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        })
        .select('deviceId alerts timestamp')
        .sort({ timestamp: -1 })
        .limit(10);

        res.json({
            success: true,
            data: {
                ...stats,
                recentAlerts
            }
        });
    } catch (error) {
        console.error('Get device stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching device statistics',
            error: error.message
        });
    }
};