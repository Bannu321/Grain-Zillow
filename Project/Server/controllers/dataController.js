const SensorData = require('../models/SensorData');
const Device = require('../models/Device');
const Notification = require('../models/Notification');
const { ROLES } = require('../config/constants');

/**
 * Data Controller
 * Handles sensor data ingestion, retrieval, and analytics
 */

exports.receiveSensorData = async (req, res) => {
    try {
        const sensorData = new SensorData(req.body);
        
        // Check for alerts
        const alerts = sensorData.checkAlerts();
        await sensorData.save();

        // Update device last seen
        await Device.findOneAndUpdate(
            { deviceId: sensorData.deviceId },
            { 
                lastSeen: new Date(),
                status: 'online'
            }
        );

        // Send notifications for critical alerts
        if (alerts.length > 0) {
            await sendAlertNotifications(sensorData.deviceId, alerts);
        }

        res.status(201).json({
            success: true,
            message: 'Data received successfully',
            data: { 
                id: sensorData._id,
                alerts: alerts.length > 0 ? alerts : undefined
            }
        });
    } catch (error) {
        console.error('Receive sensor data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error storing sensor data',
            error: error.message
        });
    }
};

exports.getSensorData = async (req, res) => {
    try {
        const { deviceId, startDate, endDate, limit = 100, page = 1 } = req.query;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        if (deviceId) query.deviceId = deviceId;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        // If user is not admin, restrict to their devices
        if (req.user.role === 'manager') {
            const manager = await require('../models/Manager').findOne({ userId: req.user.id });
            if (manager) {
                const devices = await Device.find({ managerId: manager.managerId }).select('deviceId');
                const deviceIds = devices.map(d => d.deviceId);
                query.deviceId = { $in: deviceIds };
            }
        } else if (req.user.role === 'user') {
            // Users can only see data from devices where they have storage
            const Storage = require('../models/Storage');
            const userStorage = await Storage.find({ 
                userId: req.user.id, 
                status: { $in: ['approved', 'active'] } 
            }).select('managerId');
            
            const managerIds = [...new Set(userStorage.map(s => s.managerId))];
            const managers = await require('../models/Manager').find({ managerId: { $in: managerIds } });
            const deviceIds = managers.map(m => m.zillowDevice.deviceId).filter(id => id);
            query.deviceId = { $in: deviceIds };
        }

        const data = await SensorData.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await SensorData.countDocuments(query);

        res.json({
            success: true,
            data: {
                sensorData: data,
                count: data.length,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get sensor data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sensor data',
            error: error.message
        });
    }
};

exports.getLatestData = async (req, res) => {
    try {
        let query = {};

        // Apply role-based filtering
        if (req.user.role === 'manager') {
            const manager = await require('../models/Manager').findOne({ userId: req.user.id });
            if (manager) {
                const devices = await Device.find({ managerId: manager.managerId }).select('deviceId');
                const deviceIds = devices.map(d => d.deviceId);
                query.deviceId = { $in: deviceIds };
            }
        } else if (req.user.role === 'user') {
            const Storage = require('../models/Storage');
            const userStorage = await Storage.find({ 
                userId: req.user.id, 
                status: { $in: ['approved', 'active'] } 
            }).select('managerId');
            
            const managerIds = [...new Set(userStorage.map(s => s.managerId))];
            const managers = await require('../models/Manager').find({ managerId: { $in: managerIds } });
            const deviceIds = managers.map(m => m.zillowDevice.deviceId).filter(id => id);
            query.deviceId = { $in: deviceIds };
        }

        const latestData = await SensorData.aggregate([
            { $match: query },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: "$deviceId",
                    latestData: { $first: "$$ROOT" },
                    deviceId: { $first: "$deviceId" }
                }
            },
            {
                $lookup: {
                    from: 'devices',
                    localField: 'deviceId',
                    foreignField: 'deviceId',
                    as: 'deviceInfo'
                }
            },
            {
                $unwind: {
                    path: '$deviceInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    deviceId: 1,
                    latestData: 1,
                    deviceName: '$deviceInfo.name',
                    deviceLocation: '$deviceInfo.location',
                    deviceStatus: '$deviceInfo.status'
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                devices: latestData
            }
        });
    } catch (error) {
        console.error('Get latest data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching latest data',
            error: error.message
        });
    }
};

exports.getDeviceData = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { hours = 24, limit = 100 } = req.query;

        const startTime = new Date(Date.now() - (hours * 60 * 60 * 1000));

        const data = await SensorData.find({
            deviceId,
            timestamp: { $gte: startTime }
        })
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .select('temperature humidity gasLevel timestamp status');

        const stats = await SensorData.getAverages(deviceId, hours);

        res.json({
            success: true,
            data: {
                deviceId,
                data,
                statistics: stats,
                timeRange: {
                    start: startTime,
                    end: new Date(),
                    hours: parseInt(hours)
                }
            }
        });
    } catch (error) {
        console.error('Get device data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching device data',
            error: error.message
        });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const { deviceId, hours = 24, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const startTime = new Date(Date.now() - (hours * 60 * 60 * 1000));

        let query = {
            status: { $in: ['warning', 'critical'] },
            timestamp: { $gte: startTime }
        };

        if (deviceId) {
            query.deviceId = deviceId;
        }

        // Apply role-based filtering
        if (req.user.role === 'manager') {
            const manager = await require('../models/Manager').findOne({ userId: req.user.id });
            if (manager) {
                const devices = await Device.find({ managerId: manager.managerId }).select('deviceId');
                const deviceIds = devices.map(d => d.deviceId);
                query.deviceId = { $in: deviceIds };
            }
        }

        const alerts = await SensorData.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('deviceId timestamp status alerts temperature humidity gasLevel');

        const total = await SensorData.countDocuments(query);

        res.json({
            success: true,
            data: {
                alerts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get alerts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching alerts',
            error: error.message
        });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const { deviceId, days = 7 } = req.query;
        const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

        let matchQuery = { timestamp: { $gte: startDate } };
        if (deviceId) {
            matchQuery.deviceId = deviceId;
        }

        // Apply role-based filtering
        if (req.user.role === 'manager') {
            const manager = await require('../models/Manager').findOne({ userId: req.user.id });
            if (manager) {
                const devices = await Device.find({ managerId: manager.managerId }).select('deviceId');
                const deviceIds = devices.map(d => d.deviceId);
                matchQuery.deviceId = { $in: deviceIds };
            }
        }

        const analytics = await SensorData.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        deviceId: "$deviceId",
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
                    },
                    avgTemperature: { $avg: "$temperature.value" },
                    avgHumidity: { $avg: "$humidity.value" },
                    avgGasLevel: { $avg: "$gasLevel.value" },
                    maxTemperature: { $max: "$temperature.value" },
                    minTemperature: { $min: "$temperature.value" },
                    alertCount: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["warning", "critical"]] }, 1, 0]
                        }
                    },
                    dataPoints: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.date": 1 }
            },
            {
                $group: {
                    _id: "$_id.deviceId",
                    dailyData: {
                        $push: {
                            date: "$_id.date",
                            avgTemperature: { $round: ["$avgTemperature", 2] },
                            avgHumidity: { $round: ["$avgHumidity", 2] },
                            avgGasLevel: { $round: ["$avgGasLevel", 2] },
                            maxTemperature: { $round: ["$maxTemperature", 2] },
                            minTemperature: { $round: ["$minTemperature", 2] },
                            alertCount: "$alertCount",
                            dataPoints: "$dataPoints"
                        }
                    },
                    overallStats: {
                        $push: {
                            avgTemperature: "$avgTemperature",
                            avgHumidity: "$avgHumidity",
                            avgGasLevel: "$avgGasLevel",
                            dataPoints: "$dataPoints"
                        }
                    }
                }
            },
            {
                $project: {
                    deviceId: "$_id",
                    dailyData: 1,
                    overallStats: {
                        avgTemperature: { $avg: "$overallStats.avgTemperature" },
                        avgHumidity: { $avg: "$overallStats.avgHumidity" },
                        avgGasLevel: { $avg: "$overallStats.avgGasLevel" },
                        totalDataPoints: { $sum: "$overallStats.dataPoints" },
                        totalAlerts: { $sum: "$dailyData.alertCount" }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                analytics,
                timeRange: {
                    start: startDate,
                    end: new Date(),
                    days: parseInt(days)
                }
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message
        });
    }
};

exports.exportData = async (req, res) => {
    try {
        const { deviceId, startDate, endDate, format = 'json' } = req.query;

        let query = {};
        if (deviceId) query.deviceId = deviceId;
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);

        const data = await SensorData.find(query)
            .sort({ timestamp: 1 })
            .select('deviceId timestamp temperature humidity gasLevel status')
            .lean();

        if (format === 'csv') {
            // Convert to CSV format
            const csvData = convertToCSV(data);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=sensor-data-${Date.now()}.csv`);
            return res.send(csvData);
        }

        res.json({
            success: true,
            data: {
                sensorData: data,
                count: data.length,
                exportInfo: {
                    format,
                    generatedAt: new Date(),
                    deviceId: deviceId || 'all',
                    timeRange: {
                        start: startDate || 'all',
                        end: endDate || 'all'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Export data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting data',
            error: error.message
        });
    }
};

exports.getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;
        const reportDate = date ? new Date(date) : new Date();
        reportDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(reportDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const dailyData = await SensorData.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: reportDate,
                        $lt: nextDay
                    }
                }
            },
            {
                $group: {
                    _id: "$deviceId",
                    dataPoints: { $sum: 1 },
                    avgTemperature: { $avg: "$temperature.value" },
                    avgHumidity: { $avg: "$humidity.value" },
                    avgGasLevel: { $avg: "$gasLevel.value" },
                    maxTemperature: { $max: "$temperature.value" },
                    minTemperature: { $min: "$temperature.value" },
                    criticalAlerts: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "critical"] }, 1, 0]
                        }
                    },
                    warningAlerts: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "warning"] }, 1, 0]
                        }
                    },
                    firstReading: { $first: "$timestamp" },
                    lastReading: { $last: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: 'devices',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'device'
                }
            },
            {
                $unwind: '$device'
            },
            {
                $project: {
                    deviceId: "$_id",
                    deviceName: "$device.name",
                    deviceLocation: "$device.location",
                    dataPoints: 1,
                    avgTemperature: { $round: ["$avgTemperature", 2] },
                    avgHumidity: { $round: ["$avgHumidity", 2] },
                    avgGasLevel: { $round: ["$avgGasLevel", 2] },
                    maxTemperature: { $round: ["$maxTemperature", 2] },
                    minTemperature: { $round: ["$minTemperature", 2] },
                    criticalAlerts: 1,
                    warningAlerts: 1,
                    firstReading: 1,
                    lastReading: 1,
                    operationalHours: {
                        $divide: [
                            { $subtract: ["$lastReading", "$firstReading"] },
                            1000 * 60 * 60
                        ]
                    }
                }
            }
        ]);

        const summary = {
            totalDevices: dailyData.length,
            totalDataPoints: dailyData.reduce((sum, device) => sum + device.dataPoints, 0),
            totalAlerts: dailyData.reduce((sum, device) => sum + device.criticalAlerts + device.warningAlerts, 0),
            date: reportDate.toISOString().split('T')[0]
        };

        res.json({
            success: true,
            data: {
                summary,
                devices: dailyData
            }
        });
    } catch (error) {
        console.error('Get daily report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating daily report',
            error: error.message
        });
    }
};

// Helper function to send alert notifications
async function sendAlertNotifications(deviceId, alerts) {
    try {
        const device = await Device.findOne({ deviceId });
        if (!device) return;

        const manager = await require('../models/Manager').findOne({ managerId: device.managerId });
        if (!manager) return;

        // Notify manager
        for (const alert of alerts) {
            await Notification.createDeviceAlert(
                manager.userId,
                deviceId,
                alert
            );
        }

        // Notify admin for critical alerts
        const criticalAlerts = alerts.filter(alert => 
            alert.type === 'high_temperature' || alert.type === 'gas_leak'
        );

        if (criticalAlerts.length > 0) {
            const admins = await require('../models/User').find({ role: ROLES.ADMIN });
            for (const admin of admins) {
                for (const alert of criticalAlerts) {
                    await Notification.create({
                        title: `Critical Alert: ${alert.type}`,
                        message: `Device ${deviceId} (${device.name}): ${alert.message}`,
                        type: 'alert',
                        recipient: admin._id,
                        category: 'device',
                        priority: 'urgent',
                        actionRequired: true,
                        actionUrl: `/devices/${deviceId}`,
                        actionLabel: 'View Device'
                    });
                }
            }
        }
    } catch (error) {
        console.error('Send alert notifications error:', error);
    }
}

// Helper function to convert data to CSV
function convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = ['Device ID', 'Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Gas Level (ppm)', 'Status'];
    const csvRows = [headers.join(',')];

    for (const item of data) {
        const row = [
            item.deviceId,
            item.timestamp,
            item.temperature?.value || '',
            item.humidity?.value || '',
            item.gasLevel?.value || '',
            item.status
        ];
        csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
}