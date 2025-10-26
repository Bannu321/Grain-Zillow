const DeviceControl = require('../models/DeviceControl');
const Device = require('../models/Device');
const Manager = require('../models/Manager');
const { IOT_COMMANDS, ROLES } = require('../config/constants');

/**
 * IoT Control Controller
 * Handles real-time device control commands and monitoring
 */

exports.controlDevice = async (req, res) => {
    try {
        const { deviceId, command, metadata, priority = 'normal' } = req.body;

        // Verify device exists and is active
        const device = await Device.findOne({ deviceId, isActive: true });
        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found or inactive'
            });
        }

        // Check authorization
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (!manager || device.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to control this device'
                });
            }
        }

        // Check if device is online
        if (device.status !== 'online') {
            return res.status(400).json({
                success: false,
                message: 'Device is offline and cannot receive commands'
            });
        }

        const deviceCommand = await DeviceControl.create({
            deviceId,
            command,
            issuedBy: req.user.id,
            priority,
            metadata
        });

        // Here you would typically send this command to IoT device via MQTT/WebSocket
        // For now, we'll simulate execution
        setTimeout(async () => {
            try {
                deviceCommand.status = 'executed';
                deviceCommand.executedAt = new Date();
                deviceCommand.response = {
                    receivedAt: new Date(),
                    message: 'Command executed successfully',
                    data: { simulated: true }
                };
                await deviceCommand.save();
            } catch (error) {
                console.error('Simulated command execution error:', error);
            }
        }, 1000);

        res.json({
            success: true,
            message: 'Device command issued successfully',
            data: {
                command: {
                    id: deviceCommand._id,
                    deviceId,
                    command,
                    status: deviceCommand.status,
                    priority,
                    scheduledFor: deviceCommand.scheduledFor
                }
            }
        });
    } catch (error) {
        console.error('Control device error:', error);
        res.status(500).json({
            success: false,
            message: 'Error controlling device',
            error: error.message
        });
    }
};

exports.controlMultipleDevices = async (req, res) => {
    try {
        const { commands } = req.body;

        if (!Array.isArray(commands) || commands.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Commands array is required'
            });
        }

        const results = [];
        const errors = [];

        for (const cmd of commands) {
            try {
                const { deviceId, command, metadata, priority } = cmd;

                const device = await Device.findOne({ deviceId, isActive: true });
                if (!device) {
                    errors.push({ deviceId, error: 'Device not found' });
                    continue;
                }

                // Check authorization for each device
                if (req.user.role === ROLES.MANAGER) {
                    const manager = await Manager.findOne({ userId: req.user.id });
                    if (!manager || device.managerId !== manager.managerId) {
                        errors.push({ deviceId, error: 'Not authorized' });
                        continue;
                    }
                }

                const deviceCommand = await DeviceControl.create({
                    deviceId,
                    command,
                    issuedBy: req.user.id,
                    priority: priority || 'normal',
                    metadata
                });

                results.push({
                    deviceId,
                    commandId: deviceCommand._id,
                    status: 'pending'
                });

            } catch (error) {
                errors.push({ deviceId: cmd.deviceId, error: error.message });
            }
        }

        res.json({
            success: true,
            data: {
                results,
                errors,
                totalCommands: commands.length,
                successful: results.length,
                failed: errors.length
            }
        });
    } catch (error) {
        console.error('Control multiple devices error:', error);
        res.status(500).json({
            success: false,
            message: 'Error controlling multiple devices',
            error: error.message
        });
    }
};

exports.getDeviceStatus = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOne({ deviceId })
            .populate('managerId', 'godown.name');
        
        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        // Check authorization
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (!manager || device.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to view this device'
                });
            }
        }

        const SensorData = require('../models/SensorData');
        const latestData = await SensorData.findOne({ deviceId })
            .sort({ timestamp: -1 })
            .select('temperature humidity gasLevel timestamp status');

        const pendingCommands = await DeviceControl.countDocuments({
            deviceId,
            status: 'pending'
        });

        const recentCommands = await DeviceControl.find({
            deviceId,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('issuedBy', 'username');

        res.json({
            success: true,
            data: {
                device: {
                    deviceId: device.deviceId,
                    name: device.name,
                    status: device.status,
                    lastSeen: device.lastSeen,
                    location: device.location,
                    godown: device.managerId?.godown?.name
                },
                sensorData: latestData,
                commands: {
                    pending: pendingCommands,
                    recent: recentCommands
                }
            }
        });
    } catch (error) {
        console.error('Get device status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching device status',
            error: error.message
        });
    }
};

exports.getAllDevicesStatus = async (req, res) => {
    try {
        let query = { isActive: true };

        // Apply role-based filtering
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (manager) {
                query.managerId = manager.managerId;
            }
        }

        const devices = await Device.find(query)
            .populate('managerId', 'godown.name')
            .select('deviceId name status lastSeen location configuration');

        const devicesWithStatus = await Promise.all(
            devices.map(async (device) => {
                const SensorData = require('../models/SensorData');
                const latestData = await SensorData.findOne({ deviceId: device.deviceId })
                    .sort({ timestamp: -1 })
                    .select('temperature humidity gasLevel timestamp status');

                const pendingCommands = await DeviceControl.countDocuments({
                    deviceId: device.deviceId,
                    status: 'pending'
                });

                return {
                    deviceId: device.deviceId,
                    name: device.name,
                    status: device.status,
                    lastSeen: device.lastSeen,
                    location: device.location,
                    godown: device.managerId?.godown?.name,
                    latestData,
                    pendingCommands
                };
            })
        );

        // Calculate summary statistics
        const onlineDevices = devicesWithStatus.filter(d => d.status === 'online').length;
        const devicesWithAlerts = devicesWithStatus.filter(d => 
            d.latestData && d.latestData.status === 'critical'
        ).length;

        res.json({
            success: true,
            data: {
                devices: devicesWithStatus,
                summary: {
                    total: devicesWithStatus.length,
                    online: onlineDevices,
                    offline: devicesWithStatus.length - onlineDevices,
                    withAlerts: devicesWithAlerts
                }
            }
        });
    } catch (error) {
        console.error('Get all devices status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching devices status',
            error: error.message
        });
    }
};

exports.getPendingCommands = async (req, res) => {
    try {
        const { deviceId, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = { status: 'pending' };
        if (deviceId) {
            query.deviceId = deviceId;
        }

        // Apply role-based filtering for managers
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (manager) {
                const devices = await Device.find({ managerId: manager.managerId }).select('deviceId');
                const deviceIds = devices.map(d => d.deviceId);
                query.deviceId = { $in: deviceIds };
            }
        }

        const commands = await DeviceControl.find(query)
            .populate('issuedBy', 'username role')
            .sort({ priority: -1, createdAt: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await DeviceControl.countDocuments(query);

        res.json({
            success: true,
            data: {
                commands,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get pending commands error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending commands',
            error: error.message
        });
    }
};

exports.getCommandHistory = async (req, res) => {
    try {
        const { deviceId, days = 7, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

        let query = { createdAt: { $gte: startDate } };
        if (deviceId) {
            query.deviceId = deviceId;
        }

        // Apply role-based filtering for managers
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (manager) {
                const devices = await Device.find({ managerId: manager.managerId }).select('deviceId');
                const deviceIds = devices.map(d => d.deviceId);
                query.deviceId = { $in: deviceIds };
            }
        }

        const commands = await DeviceControl.find(query)
            .populate('issuedBy', 'username role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await DeviceControl.countDocuments(query);

        res.json({
            success: true,
            data: {
                commands,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get command history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching command history',
            error: error.message
        });
    }
};

exports.cancelCommand = async (req, res) => {
    try {
        const { commandId } = req.params;

        const command = await DeviceControl.findById(commandId);
        if (!command) {
            return res.status(404).json({
                success: false,
                message: 'Command not found'
            });
        }

        // Check authorization
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            const device = await Device.findOne({ deviceId: command.deviceId });
            if (!manager || !device || device.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to cancel this command'
                });
            }
        }

        if (command.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending commands can be cancelled'
            });
        }

        command.status = 'cancelled';
        await command.save();

        res.json({
            success: true,
            message: 'Command cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel command error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling command',
            error: error.message
        });
    }
};

exports.retryCommand = async (req, res) => {
    try {
        const { commandId } = req.params;

        const command = await DeviceControl.findById(commandId);
        if (!command) {
            return res.status(404).json({
                success: false,
                message: 'Command not found'
            });
        }

        // Check authorization
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            const device = await Device.findOne({ deviceId: command.deviceId });
            if (!manager || !device || device.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to retry this command'
                });
            }
        }

        if (command.status !== 'failed') {
            return res.status(400).json({
                success: false,
                message: 'Only failed commands can be retried'
            });
        }

        if (!command.canRetry) {
            return res.status(400).json({
                success: false,
                message: 'Maximum retry attempts exceeded'
            });
        }

        await command.retry();

        res.json({
            success: true,
            message: 'Command queued for retry',
            data: {
                command: {
                    id: command._id,
                    deviceId: command.deviceId,
                    command: command.command,
                    status: command.status,
                    retryCount: command.metadata.retryCount
                }
            }
        });
    } catch (error) {
        console.error('Retry command error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrying command',
            error: error.message
        });
    }
};

exports.updateAutoControl = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { autoControl } = req.body;

        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        // Verify the device belongs to the manager
        const manager = await Manager.findOne({ userId: req.user.id });
        if (!manager || device.managerId !== manager.managerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this device'
            });
        }

        device.configuration.autoControl = {
            ...device.configuration.autoControl,
            ...autoControl
        };
        await device.save();

        res.json({
            success: true,
            message: 'Auto-control settings updated successfully',
            data: {
                autoControl: device.configuration.autoControl
            }
        });
    } catch (error) {
        console.error('Update auto-control error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating auto-control settings',
            error: error.message
        });
    }
};

exports.getAutoControl = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOne({ deviceId })
            .select('deviceId name configuration.autoControl');
        
        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        // Check authorization
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (!manager || device.managerId !== manager.managerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to view this device'
                });
            }
        }

        res.json({
            success: true,
            data: {
                deviceId: device.deviceId,
                name: device.name,
                autoControl: device.configuration.autoControl
            }
        });
    } catch (error) {
        console.error('Get auto-control error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching auto-control settings',
            error: error.message
        });
    }
};

exports.emergencyAllFansOn = async (req, res) => {
    try {
        let query = { isActive: true, status: 'online' };

        // Apply role-based filtering for managers
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (manager) {
                query.managerId = manager.managerId;
            }
        }

        const devices = await Device.find(query).select('deviceId');
        
        const commands = [];
        const errors = [];

        for (const device of devices) {
            try {
                const command = await DeviceControl.create({
                    deviceId: device.deviceId,
                    command: IOT_COMMANDS.FAN_ON,
                    issuedBy: req.user.id,
                    priority: 'critical',
                    metadata: { emergency: true, initiatedBy: req.user.username }
                });
                commands.push(command);
            } catch (error) {
                errors.push({ deviceId: device.deviceId, error: error.message });
            }
        }

        res.json({
            success: true,
            message: `Emergency fan-on command sent to ${commands.length} devices`,
            data: {
                commandsIssued: commands.length,
                errors: errors.length,
                details: {
                    commands: commands.map(c => ({ deviceId: c.deviceId, commandId: c._id })),
                    errors
                }
            }
        });
    } catch (error) {
        console.error('Emergency all fans on error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending emergency commands',
            error: error.message
        });
    }
};

exports.emergencyAllPumpsOff = async (req, res) => {
    try {
        let query = { isActive: true, status: 'online' };

        // Apply role-based filtering for managers
        if (req.user.role === ROLES.MANAGER) {
            const manager = await Manager.findOne({ userId: req.user.id });
            if (manager) {
                query.managerId = manager.managerId;
            }
        }

        const devices = await Device.find(query).select('deviceId');
        
        const commands = [];
        const errors = [];

        for (const device of devices) {
            try {
                const command = await DeviceControl.create({
                    deviceId: device.deviceId,
                    command: IOT_COMMANDS.PUMP_OFF,
                    issuedBy: req.user.id,
                    priority: 'critical',
                    metadata: { emergency: true, initiatedBy: req.user.username }
                });
                commands.push(command);
            } catch (error) {
                errors.push({ deviceId: device.deviceId, error: error.message });
            }
        }

        res.json({
            success: true,
            message: `Emergency pump-off command sent to ${commands.length} devices`,
            data: {
                commandsIssued: commands.length,
                errors: errors.length,
                details: {
                    commands: commands.map(c => ({ deviceId: c.deviceId, commandId: c._id })),
                    errors
                }
            }
        });
    } catch (error) {
        console.error('Emergency all pumps off error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending emergency commands',
            error: error.message
        });
    }
};