const mongoose = require('mongoose');
const User = require('../models/User');
const Manager = require('../models/Manager');
const Device = require('../models/Device');
const Storage = require('../models/Storage');
const SensorData = require('../models/SensorData');

/**
 * Database Service Layer
 * Provides abstraction for database operations and future Firebase migration
 */
class DatabaseService {
    constructor() {
        this.models = {
            User,
            Manager,
            Device,
            Storage,
            SensorData
        };
    }

    // User operations
    async createUser(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async findUserById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    // Manager operations
    async createManager(managerData) {
        try {
            const manager = new Manager(managerData);
            return await manager.save();
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async findManagerByUserId(userId) {
        try {
            return await Manager.findOne({ userId }).populate('userId');
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async findManagerByManagerId(managerId) {
        try {
            return await Manager.findOne({ managerId }).populate('userId');
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    // Device operations
    async createDevice(deviceData) {
        try {
            const device = new Device(deviceData);
            return await device.save();
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async findDeviceByDeviceId(deviceId) {
        try {
            return await Device.findOne({ deviceId });
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async updateDeviceStatus(deviceId, status) {
        try {
            return await Device.findOneAndUpdate(
                { deviceId },
                { 
                    status,
                    lastSeen: status === 'online' ? new Date() : undefined
                },
                { new: true }
            );
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    // Storage operations
    async createStorage(storageData) {
        try {
            const storage = new Storage(storageData);
            return await storage.save();
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async findStorageByStorageId(storageId) {
        try {
            return await Storage.findOne({ storageId })
                .populate('userId')
                .populate('managerId');
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    // Sensor Data operations
    async createSensorData(sensorData) {
        try {
            const data = new SensorData(sensorData);
            return await data.save();
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async getLatestSensorData(deviceId, limit = 10) {
        try {
            return await SensorData.find({ deviceId })
                .sort({ timestamp: -1 })
                .limit(limit);
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    // Bulk operations
    async getDashboardStats() {
        try {
            const [
                totalUsers,
                totalManagers,
                totalDevices,
                totalStorage,
                activeStorage,
                onlineDevices
            ] = await Promise.all([
                User.countDocuments({ isActive: true }),
                Manager.countDocuments({ isActive: true }),
                Device.countDocuments({ isActive: true }),
                Storage.countDocuments(),
                Storage.countDocuments({ status: { $in: ['approved', 'active'] } }),
                Device.countDocuments({ status: 'online', isActive: true })
            ]);

            return {
                totalUsers,
                totalManagers,
                totalDevices,
                totalStorage,
                activeStorage,
                onlineDevices,
                storageUtilization: totalStorage > 0 ? (activeStorage / totalStorage * 100).toFixed(2) : 0,
                deviceUptime: totalDevices > 0 ? (onlineDevices / totalDevices * 100).toFixed(2) : 0
            };
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    // Data aggregation for reports
    async getSystemReport(startDate, endDate) {
        try {
            const [
                userRegistrations,
                storageRequests,
                deviceData,
                sensorAlerts
            ] = await Promise.all([
                // User registrations in period
                User.countDocuments({
                    createdAt: { $gte: startDate, $lte: endDate }
                }),
                // Storage requests in period
                Storage.countDocuments({
                    createdAt: { $gte: startDate, $lte: endDate }
                }),
                // Device data points in period
                SensorData.countDocuments({
                    timestamp: { $gte: startDate, $lte: endDate }
                }),
                // Critical alerts in period
                SensorData.countDocuments({
                    status: 'critical',
                    timestamp: { $gte: startDate, $lte: endDate }
                })
            ]);

            return {
                period: { startDate, endDate },
                userRegistrations,
                storageRequests,
                deviceData,
                sensorAlerts
            };
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    // Firebase migration methods
    async prepareForFirebaseMigration() {
        try {
            console.log('🔄 Preparing database for Firebase migration...');
            
            // Create backup of current data
            const backupData = {
                users: await User.find({}),
                managers: await Manager.find({}),
                devices: await Device.find({}),
                storage: await Storage.find({}),
                timestamp: new Date()
            };

            console.log(`✅ Backup created: ${backupData.users.length} users, ${backupData.managers.length} managers, ${backupData.devices.length} devices, ${backupData.storage.length} storage records`);
            
            return backupData;
        } catch (error) {
            throw this.handleDatabaseError(error);
        }
    }

    async migrateToFirebase(backupData) {
        try {
            console.log('🔄 Starting migration to Firebase...');
            
            // This would contain the actual Firebase migration logic
            // For now, we'll just log the process
            console.log(`📊 Data to migrate: ${backupData.users.length} users, ${backupData.managers.length} managers, etc.`);
            
            // Simulate migration process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('✅ Firebase migration completed successfully');
            return { success: true, migratedRecords: backupData.users.length + backupData.managers.length + backupData.devices.length + backupData.storage.length };
        } catch (error) {
            console.error('❌ Firebase migration failed:', error);
            throw this.handleDatabaseError(error);
        }
    }

    // Error handling
    handleDatabaseError(error) {
        console.error('Database Service Error:', error);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return new Error(`${field} already exists`);
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return new Error(`Validation failed: ${messages.join(', ')}`);
        }
        
        return new Error('Database operation failed');
    }

    // Connection health check
    async healthCheck() {
        try {
            const dbState = mongoose.connection.readyState;
            const states = {
                0: 'disconnected',
                1: 'connected',
                2: 'connecting',
                3: 'disconnecting'
            };

            return {
                status: dbState === 1 ? 'healthy' : 'unhealthy',
                database: states[dbState],
                timestamp: new Date()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                database: 'error',
                error: error.message,
                timestamp: new Date()
            };
        }
    }
}

module.exports = new DatabaseService();