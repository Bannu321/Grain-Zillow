const DeviceControl = require('../models/DeviceControl');
const Device = require('../models/Device');
const SensorData = require('../models/SensorData');
const NotificationService = require('./notificationService');

/**
 * IoT Service
 * Handles IoT device communication, command processing, and automation
 */
class IoTService {
    constructor() {
        this.commandQueue = new Map();
        this.autoControlEnabled = true;
    }

    // Process pending commands for a device
    async processPendingCommands(deviceId, limit = 5) {
        try {
            const pendingCommands = await DeviceControl.getPendingCommands(deviceId, limit);
            
            for (const command of pendingCommands) {
                await this.executeCommand(command);
            }

            return {
                processed: pendingCommands.length,
                deviceId
            };
        } catch (error) {
            console.error(`Process pending commands error for device ${deviceId}:`, error);
            throw new Error(`Failed to process commands for device ${deviceId}`);
        }
    }

    // Execute a single command
    async executeCommand(command) {
        try {
            console.log(`🔧 Executing command: ${command.command} for device ${command.deviceId}`);
            
            // Simulate command execution (replace with actual IoT device communication)
            const success = Math.random() > 0.1; // 90% success rate for simulation
            
            if (success) {
                await command.markExecuted({
                    message: 'Command executed successfully',
                    data: { 
                        executedAt: new Date(),
                        simulated: true 
                    }
                });
                
                console.log(`✅ Command ${command._id} executed successfully`);
            } else {
                await command.markFailed('Simulated command failure');
                console.log(`❌ Command ${command._id} failed`);
            }

            return success;
        } catch (error) {
            console.error(`Execute command error for command ${command._id}:`, error);
            await command.markFailed(error.message);
            throw new Error(`Failed to execute command ${command._id}`);
        }
    }

    // Process sensor data and trigger auto-control
    async processSensorData(sensorData) {
        try {
            const device = await Device.findOne({ deviceId: sensorData.deviceId });
            if (!device || !this.autoControlEnabled) {
                return;
            }

            const autoControl = device.configuration.autoControl;
            const commands = [];

            // Auto fan control based on temperature
            if (autoControl.fan) {
                if (sensorData.temperature.value > device.configuration.temperatureThreshold.max) {
                    commands.push({
                        command: 'fan_on',
                        reason: `High temperature: ${sensorData.temperature.value}°C`
                    });
                } else if (sensorData.temperature.value < device.configuration.temperatureThreshold.min) {
                    commands.push({
                        command: 'fan_off', 
                        reason: `Low temperature: ${sensorData.temperature.value}°C`
                    });
                }
            }

            // Auto pump control based on humidity
            if (autoControl.pump) {
                if (sensorData.humidity.value < 30) { // Too dry
                    commands.push({
                        command: 'pump_on',
                        reason: `Low humidity: ${sensorData.humidity.value}%`
                    });
                } else if (sensorData.humidity.value > 70) { // Too humid
                    commands.push({
                        command: 'pump_off',
                        reason: `High humidity: ${sensorData.humidity.value}%`
                    });
                }
            }

            // Execute auto-control commands
            for (const cmd of commands) {
                await this.controlDevice(
                    sensorData.deviceId,
                    cmd.command,
                    'system',
                    { 
                        priority: 'low',
                        metadata: { 
                            autoControl: true,
                            reason: cmd.reason,
                            triggeredBy: 'sensor_data',
                            sensorData: {
                                temperature: sensorData.temperature.value,
                                humidity: sensorData.humidity.value,
                                gasLevel: sensorData.gasLevel.value
                            }
                        }
                    }
                );
            }

            return commands.length;
        } catch (error) {
            console.error(`Process sensor data error for device ${sensorData.deviceId}:`, error);
            throw new Error('Failed to process sensor data for auto-control');
        }
    }

    // Control device with enhanced logic
    async controlDevice(deviceId, command, issuedBy, options = {}) {
        try {
            const device = await Device.findOne({ deviceId });
            if (!device) {
                throw new Error(`Device ${deviceId} not found`);
            }

            if (device.status !== 'online') {
                throw new Error(`Device ${deviceId} is offline`);
            }

            const deviceCommand = await DeviceControl.create({
                deviceId,
                command,
                issuedBy,
                priority: options.priority || 'normal',
                metadata: options.metadata
            });

            // Add to processing queue
            this.addToQueue(deviceCommand);

            return deviceCommand;
        } catch (error) {
            console.error(`Control device error for ${deviceId}:`, error);
            throw new Error(`Failed to control device ${deviceId}`);
        }
    }

    // Device health monitoring
    async checkDeviceHealth(deviceId) {
        try {
            const device = await Device.findOne({ deviceId });
            if (!device) {
                return { status: 'unknown', message: 'Device not found' };
            }

            const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
            const isOnline = device.lastSeen > twentyMinutesAgo;

            // Get recent sensor data for health assessment
            const recentData = await SensorData.find({
                deviceId,
                timestamp: { $gte: twentyMinutesAgo }
            }).sort({ timestamp: -1 }).limit(10);

            const health = {
                deviceId,
                status: isOnline ? 'online' : 'offline',
                lastSeen: device.lastSeen,
                dataPoints: recentData.length,
                averageInterval: this.calculateAverageInterval(recentData),
                recentAlerts: recentData.filter(data => data.status === 'critical').length
            };

            // Alert if device has been offline for too long
            if (!isOnline && device.status === 'online') {
                await NotificationService.notifyDeviceAlert(deviceId, {
                    type: 'device_offline',
                    message: `Device ${deviceId} has been offline for more than 20 minutes`,
                    value: null,
                    threshold: null
                });
            }

            return health;
        } catch (error) {
            console.error(`Check device health error for ${deviceId}:`, error);
            throw new Error(`Failed to check health for device ${deviceId}`);
        }
    }

    // Bulk device control
    async controlMultipleDevices(deviceIds, command, issuedBy, options = {}) {
        try {
            const results = [];
            const errors = [];

            for (const deviceId of deviceIds) {
                try {
                    const commandResult = await this.controlDevice(deviceId, command, issuedBy, options);
                    results.push({
                        deviceId,
                        commandId: commandResult._id,
                        status: 'queued'
                    });
                } catch (error) {
                    errors.push({
                        deviceId,
                        error: error.message
                    });
                }
            }

            return {
                total: deviceIds.length,
                successful: results.length,
                failed: errors.length,
                results,
                errors
            };
        } catch (error) {
            console.error('Control multiple devices error:', error);
            throw new Error('Failed to control multiple devices');
        }
    }

    // Emergency shutdown for a location
    async emergencyShutdown(managerId) {
        try {
            const devices = await Device.find({ 
                managerId, 
                isActive: true,
                status: 'online'
            });

            const deviceIds = devices.map(device => device.deviceId);
            
            // Turn off all pumps and buzzers, turn on fans for ventilation
            const commands = [
                ...deviceIds.map(deviceId => 
                    this.controlDevice(deviceId, 'pump_off', 'system', { priority: 'critical' })
                ),
                ...deviceIds.map(deviceId => 
                    this.controlDevice(deviceId, 'buzzer_off', 'system', { priority: 'critical' })
                ),
                ...deviceIds.map(deviceId => 
                    this.controlDevice(deviceId, 'fan_on', 'system', { priority: 'critical' })
                )
            ];

            await Promise.all(commands);

            await NotificationService.sendSystemAlert(
                'Emergency Shutdown Activated',
                `Emergency shutdown has been activated for manager ${managerId}. All pumps and buzzers turned off, fans activated.`,
                'urgent'
            );

            return {
                devices: deviceIds.length,
                commands: commands.length,
                managerId
            };
        } catch (error) {
            console.error(`Emergency shutdown error for manager ${managerId}:`, error);
            throw new Error(`Failed to execute emergency shutdown for manager ${managerId}`);
        }
    }

    // Get command execution statistics
    async getCommandStats(days = 7) {
        try {
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

            const stats = await DeviceControl.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            status: '$status',
                            command: '$command'
                        },
                        count: { $sum: 1 },
                        avgExecutionTime: {
                            $avg: {
                                $subtract: ['$executedAt', '$createdAt']
                            }
                        }
                    }
                }
            ]);

            const totalCommands = await DeviceControl.countDocuments({
                createdAt: { $gte: startDate }
            });

            const pendingCommands = await DeviceControl.countDocuments({
                status: 'pending',
                createdAt: { $gte: startDate }
            });

            return {
                period: { startDate, endDate: new Date(), days },
                totalCommands,
                pendingCommands,
                executedCommands: totalCommands - pendingCommands,
                breakdown: stats
            };
        } catch (error) {
            console.error('Get command stats error:', error);
            throw new Error('Failed to get command statistics');
        }
    }

    // Private methods
    addToQueue(command) {
        if (!this.commandQueue.has(command.deviceId)) {
            this.commandQueue.set(command.deviceId, []);
        }
        
        this.commandQueue.get(command.deviceId).push(command);
        
        // Process queue (in real implementation, this would be more sophisticated)
        setTimeout(() => {
            this.processPendingCommands(command.deviceId);
        }, 100);
    }

    calculateAverageInterval(dataPoints) {
        if (dataPoints.length < 2) return null;
        
        let totalInterval = 0;
        for (let i = 1; i < dataPoints.length; i++) {
            const interval = dataPoints[i-1].timestamp - dataPoints[i].timestamp;
            totalInterval += interval;
        }
        
        return totalInterval / (dataPoints.length - 1) / 1000; // Convert to seconds
    }

    // Start background processing
    startBackgroundProcessing() {
        // Process pending commands every 30 seconds
        setInterval(async () => {
            try {
                const onlineDevices = await Device.find({ 
                    status: 'online',
                    isActive: true 
                }).select('deviceId');
                
                for (const device of onlineDevices) {
                    await this.processPendingCommands(device.deviceId);
                }
            } catch (error) {
                console.error('Background command processing error:', error);
            }
        }, 30000);

        // Check device health every 5 minutes
        setInterval(async () => {
            try {
                const devices = await Device.find({ isActive: true }).select('deviceId');
                
                for (const device of devices) {
                    await this.checkDeviceHealth(device.deviceId);
                }
            } catch (error) {
                console.error('Background health check error:', error);
            }
        }, 300000);

        console.log('🔧 IoT Service background processing started');
    }
}

module.exports = new IoTService();