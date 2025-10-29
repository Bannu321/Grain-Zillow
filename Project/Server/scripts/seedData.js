const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const databaseService = require('../config/database');
const User = require('../models/User');
const Manager = require('../models/Manager');
const Device = require('../models/Device');
const Storage = require('../models/Storage');
const { ROLES } = require('../config/constants');

/**
 * Database Seeding Script
 * Populates the database with initial sample data for development and testing
 */

class Seeder {
    constructor() {
        this.users = [];
        this.managers = [];
        this.devices = [];
        this.storages = [];
    }

    async connect() {
        try {
            await databaseService.connect();
            console.log('✅ Connected to database');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            process.exit(1);
        }
    }

    async clearDatabase() {
        try {
            console.log('🧹 Clearing existing data...');
            
            await User.deleteMany({});
            await Manager.deleteMany({});
            await Device.deleteMany({});
            await Storage.deleteMany({});
            
            console.log('✅ Database cleared');
        } catch (error) {
            console.error('❌ Error clearing database:', error);
            throw error;
        }
    }

    async createUsers() {
        try {
            console.log('👥 Creating users...');

            const usersData = [
                {
                    username: 'admin',
                    email: 'admin@grainzillow.com',
                    password: 'Admin123!',
                    role: ROLES.ADMIN,
                    isApproved: true,
                    profile: {
                        firstName: 'System',
                        lastName: 'Administrator',
                        phone: '9876543210'
                    }
                },
                {
                    username: 'manager1',
                    email: 'manager1@grainzillow.com',
                    password: 'Manager123!',
                    role: ROLES.MANAGER,
                    isApproved: true,
                    profile: {
                        firstName: 'Raj',
                        lastName: 'Kumar',
                        phone: '9876543211'
                    }
                },
                {
                    username: 'manager2',
                    email: 'manager2@grainzillow.com',
                    password: 'Manager123!',
                    role: ROLES.MANAGER,
                    isApproved: true,
                    profile: {
                        firstName: 'Priya',
                        lastName: 'Sharma',
                        phone: '9876543212'
                    }
                },
                {
                    username: 'user1',
                    email: 'user1@example.com',
                    password: 'User123!',
                    role: ROLES.USER,
                    isApproved: true,
                    profile: {
                        firstName: 'Amit',
                        lastName: 'Verma',
                        phone: '9876543213'
                    }
                },
                {
                    username: 'user2',
                    email: 'user2@example.com',
                    password: 'User123!',
                    role: ROLES.USER,
                    isApproved: true,
                    profile: {
                        firstName: 'Neha',
                        lastName: 'Gupta',
                        phone: '9876543214'
                    }
                },
                {
                    username: 'user3',
                    email: 'user3@example.com',
                    password: 'User123!',
                    role: ROLES.USER,
                    isApproved: false, // Pending approval
                    profile: {
                        firstName: 'Sanjay',
                        lastName: 'Patel',
                        phone: '9876543215'
                    }
                }
            ];

            for (const userData of usersData) {
                const user = new User(userData);
                await user.save();
                this.users.push(user);
                console.log(`✅ Created user: ${user.username}`);
            }

            console.log(`✅ Created ${this.users.length} users`);
        } catch (error) {
            console.error('❌ Error creating users:', error);
            throw error;
        }
    }

    async createManagers() {
        try {
            console.log('🏢 Creating managers...');

            const managersData = [
                {
                    userId: this.users.find(u => u.username === 'manager1')._id,
                    managerId: 'MGR1001',
                    godown: {
                        name: 'Central Godown',
                        location: {
                            address: '123 Grain Street, Industrial Area',
                            city: 'Mumbai',
                            state: 'Maharashtra',
                            pincode: '400001',
                            coordinates: {
                                latitude: 19.0760,
                                longitude: 72.8777
                            }
                        },
                        totalCapacity: 10000,
                        availableCapacity: 6500,
                        description: 'Main storage facility with advanced climate control'
                    },
                    contact: {
                        phone: '9876543211',
                        address: '123 Grain Street, Mumbai'
                    },
                    zillowDevice: {
                        deviceId: 'ZILLOW_MGR1001',
                        status: 'online',
                        lastActive: new Date()
                    }
                },
                {
                    userId: this.users.find(u => u.username === 'manager2')._id,
                    managerId: 'MGR1002',
                    godown: {
                        name: 'Northern Storage',
                        location: {
                            address: '456 Wheat Road, Commercial Zone',
                            city: 'Delhi',
                            state: 'Delhi',
                            pincode: '110001',
                            coordinates: {
                                latitude: 28.7041,
                                longitude: 77.1025
                            }
                        },
                        totalCapacity: 8000,
                        availableCapacity: 3000,
                        description: 'Northern region storage with humidity control'
                    },
                    contact: {
                        phone: '9876543212',
                        address: '456 Wheat Road, Delhi'
                    },
                    zillowDevice: {
                        deviceId: 'ZILLOW_MGR1002',
                        status: 'online',
                        lastActive: new Date()
                    }
                }
            ];

            for (const managerData of managersData) {
                const manager = new Manager(managerData);
                await manager.save();
                this.managers.push(manager);
                console.log(`✅ Created manager: ${manager.managerId} - ${manager.godown.name}`);
            }

            console.log(`✅ Created ${this.managers.length} managers`);
        } catch (error) {
            console.error('❌ Error creating managers:', error);
            throw error;
        }
    }

    async createDevices() {
        try {
            console.log('📱 Creating devices...');

            const devicesData = [
                {
                    deviceId: 'ZILLOW_MGR1001',
                    name: 'Central Godown - Zillow Device',
                    managerId: 'MGR1001',
                    location: 'Central Godown, Mumbai',
                    status: 'online',
                    configuration: {
                        temperatureThreshold: { min: 15, max: 35 },
                        humidityThreshold: { min: 40, max: 60 },
                        gasThreshold: { max: 800 },
                        samplingInterval: 300,
                        autoControl: {
                            fan: true,
                            pump: false,
                            buzzer: true
                        }
                    },
                    lastSeen: new Date(),
                    firmwareVersion: '1.2.3',
                    ipAddress: '192.168.1.100'
                },
                {
                    deviceId: 'ZILLOW_MGR1002',
                    name: 'Northern Storage - Zillow Device',
                    managerId: 'MGR1002',
                    location: 'Northern Storage, Delhi',
                    status: 'online',
                    configuration: {
                        temperatureThreshold: { min: 10, max: 30 },
                        humidityThreshold: { min: 35, max: 65 },
                        gasThreshold: { max: 900 },
                        samplingInterval: 300,
                        autoControl: {
                            fan: true,
                            pump: true,
                            buzzer: true
                        }
                    },
                    lastSeen: new Date(),
                    firmwareVersion: '1.2.3',
                    ipAddress: '192.168.1.101'
                },
                {
                    deviceId: 'ZILLOW_TEST001',
                    name: 'Test Device - Offline',
                    managerId: 'MGR1001',
                    location: 'Test Location',
                    status: 'offline',
                    configuration: {
                        temperatureThreshold: { min: 15, max: 35 },
                        humidityThreshold: { min: 40, max: 60 },
                        gasThreshold: { max: 800 },
                        samplingInterval: 300,
                        autoControl: {
                            fan: false,
                            pump: false,
                            buzzer: true
                        }
                    },
                    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
                    firmwareVersion: '1.1.0',
                    ipAddress: '192.168.1.102'
                }
            ];

            for (const deviceData of devicesData) {
                const device = new Device(deviceData);
                await device.save();
                this.devices.push(device);
                console.log(`✅ Created device: ${device.deviceId} - ${device.name}`);
            }

            console.log(`✅ Created ${this.devices.length} devices`);
        } catch (error) {
            console.error('❌ Error creating devices:', error);
            throw error;
        }
    }

    async createStorages() {
        try {
            console.log('🏗️ Creating storage requests...');

            const user1 = this.users.find(u => u.username === 'user1');
            const user2 = this.users.find(u => u.username === 'user2');

            const storagesData = [
                {
                    storageId: 'STR1001',
                    userId: user1._id,
                    managerId: 'MGR1001',
                    grainType: 'wheat',
                    quantity: 5000,
                    capacity: 5000,
                    status: 'active',
                    duration: {
                        startDate: new Date('2024-01-01'),
                        endDate: new Date('2024-06-30'),
                        plannedDuration: 180
                    },
                    notes: 'High quality wheat for export',
                    qualityMetrics: {
                        moistureContent: 12.5,
                        foreignMaterial: 1.2,
                        temperature: 22,
                        lastChecked: new Date()
                    },
                    pricing: {
                        ratePerUnit: 25,
                        totalCost: 125000,
                        paymentStatus: 'paid'
                    }
                },
                {
                    storageId: 'STR1002',
                    userId: user2._id,
                    managerId: 'MGR1001',
                    grainType: 'rice',
                    quantity: 3000,
                    capacity: 3000,
                    status: 'active',
                    duration: {
                        startDate: new Date('2024-02-01'),
                        endDate: new Date('2024-05-31'),
                        plannedDuration: 120
                    },
                    notes: 'Basmati rice storage',
                    qualityMetrics: {
                        moistureContent: 13.0,
                        foreignMaterial: 0.8,
                        temperature: 20,
                        lastChecked: new Date()
                    },
                    pricing: {
                        ratePerUnit: 30,
                        totalCost: 90000,
                        paymentStatus: 'paid'
                    }
                },
                {
                    storageId: 'STR1003',
                    userId: user1._id,
                    managerId: 'MGR1002',
                    grainType: 'corn',
                    quantity: 2000,
                    capacity: 2000,
                    status: 'approved',
                    duration: {
                        startDate: new Date('2024-03-01'),
                        plannedDuration: 90
                    },
                    notes: 'Animal feed corn'
                },
                {
                    storageId: 'STR1004',
                    userId: user2._id,
                    managerId: 'MGR1002',
                    grainType: 'barley',
                    quantity: 1500,
                    capacity: 1500,
                    status: 'pending',
                    duration: {
                        plannedDuration: 60
                    },
                    notes: 'Brewing quality barley'
                }
            ];

            for (const storageData of storagesData) {
                const storage = new Storage(storageData);
                await storage.save();
                this.storages.push(storage);
                console.log(`✅ Created storage: ${storage.storageId} - ${storage.grainType}`);
            }

            console.log(`✅ Created ${this.storages.length} storage requests`);
        } catch (error) {
            console.error('❌ Error creating storage requests:', error);
            throw error;
        }
    }

    async generateSensorData() {
        try {
            console.log('📊 Generating sample sensor data...');
            
            const SensorData = require('../models/SensorData');
            
            // Generate data for last 7 days for each device
            for (const device of this.devices) {
                if (device.status === 'offline') continue;
                
                const dataPoints = [];
                const now = new Date();
                
                for (let i = 0; i < 168; i++) { // 7 days * 24 hours = 168 data points
                    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Each hour
                    
                    const temperature = 20 + Math.random() * 15; // 20-35°C
                    const humidity = 40 + Math.random() * 30; // 40-70%
                    const gasLevel = 100 + Math.random() * 400; // 100-500 ppm
                    
                    let status = 'normal';
                    if (temperature > 45 || gasLevel > 800) {
                        status = 'critical';
                    } else if (temperature > 35 || humidity > 75) {
                        status = 'warning';
                    }
                    
                    const sensorData = new SensorData({
                        deviceId: device.deviceId,
                        timestamp,
                        temperature: { value: parseFloat(temperature.toFixed(2)), unit: 'C' },
                        humidity: { value: parseFloat(humidity.toFixed(2)), unit: '%' },
                        gasLevel: { value: parseFloat(gasLevel.toFixed(2)), unit: 'ppm' },
                        status,
                        coordinates: {
                            latitude: 19.0760 + (Math.random() - 0.5) * 0.01,
                            longitude: 72.8777 + (Math.random() - 0.5) * 0.01
                        }
                    });
                    
                    dataPoints.push(sensorData);
                }
                
                // Insert in batches to avoid memory issues
                for (let i = 0; i < dataPoints.length; i += 50) {
                    const batch = dataPoints.slice(i, i + 50);
                    await SensorData.insertMany(batch);
                }
                
                console.log(`✅ Generated ${dataPoints.length} sensor data points for ${device.deviceId}`);
            }
            
            console.log('✅ Sensor data generation completed');
        } catch (error) {
            console.error('❌ Error generating sensor data:', error);
            throw error;
        }
    }

    async run() {
        try {
            console.log('🚀 Starting database seeding...');
            console.log('================================');
            
            await this.connect();
            await this.clearDatabase();
            
            await this.createUsers();
            await this.createManagers();
            await this.createDevices();
            await this.createStorages();
            await this.generateSensorData();
            
            console.log('================================');
            console.log('✅ Database seeding completed successfully!');
            console.log('');
            console.log('📊 Summary:');
            console.log(`   👥 Users: ${this.users.length}`);
            console.log(`   🏢 Managers: ${this.managers.length}`);
            console.log(`   📱 Devices: ${this.devices.length}`);
            console.log(`   🏗️ Storage Requests: ${this.storages.length}`);
            console.log('');
            console.log('🔑 Sample Login Credentials:');
            console.log('   Admin: admin@grainzillow.com / Admin123!');
            console.log('   Manager: manager1@grainzillow.com / Manager123!');
            console.log('   User: user1@example.com / User123!');
            console.log('');
            
            process.exit(0);
        } catch (error) {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        }
    }
}

// Run seeder if called directly
if (require.main === module) {
    const seeder = new Seeder();
    seeder.run();
}

module.exports = Seeder;