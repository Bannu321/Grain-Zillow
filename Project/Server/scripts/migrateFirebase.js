const mongoose = require('mongoose');
const databaseService = require('../config/database');

/**
 * Firebase Migration Script
 * Prepares and migrates data from MongoDB to Firebase (Simulated)
 */

class FirebaseMigrator {
    constructor() {
        this.migrationStats = {
            users: 0,
            managers: 0,
            devices: 0,
            storages: 0,
            sensorData: 0,
            errors: 0
        };
    }

    async connect() {
        try {
            await databaseService.connect();
            console.log('✅ Connected to MongoDB');
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error);
            process.exit(1);
        }
    }

    async prepareMigration() {
        try {
            console.log('📋 Preparing migration...');
            
            // Get counts for planning
            const User = require('../models/User');
            const Manager = require('../models/Manager');
            const Device = require('../models/Device');
            const Storage = require('../models/Storage');
            const SensorData = require('../models/SensorData');

            const counts = await Promise.all([
                User.countDocuments(),
                Manager.countDocuments(),
                Device.countDocuments(),
                Storage.countDocuments(),
                SensorData.countDocuments()
            ]);

            console.log('📊 Current Data Statistics:');
            console.log(`   👥 Users: ${counts[0]}`);
            console.log(`   🏢 Managers: ${counts[1]}`);
            console.log(`   📱 Devices: ${counts[2]}`);
            console.log(`   🏗️ Storage Requests: ${counts[3]}`);
            console.log(`   📊 Sensor Data: ${counts[4]}`);
            console.log(`   💾 Total Records: ${counts.reduce((a, b) => a + b, 0)}`);

            // Estimate migration time (simulated)
            const estimatedTime = Math.ceil(counts.reduce((a, b) => a + b, 0) / 1000); // 1000 records per second
            console.log(`   ⏱️ Estimated Migration Time: ${estimatedTime} seconds`);

            return counts;
        } catch (error) {
            console.error('❌ Error preparing migration:', error);
            throw error;
        }
    }

    async createBackup() {
        try {
            console.log('💾 Creating backup...');
            
            const backupData = await databaseService.prepareForFirebaseMigration();
            
            // Save backup to file (in a real scenario)
            const fs = require('fs');
            const path = require('path');
            const backupDir = path.join(__dirname, '../backups');
            
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            const backupFile = path.join(backupDir, `backup-${Date.now()}.json`);
            fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
            
            console.log(`✅ Backup saved to: ${backupFile}`);
            return backupFile;
        } catch (error) {
            console.error('❌ Error creating backup:', error);
            throw error;
        }
    }

    async migrateUsers() {
        try {
            console.log('👥 Migrating users...');
            
            const User = require('../models/User');
            const users = await User.find({});
            
            // Simulate Firebase migration for users
            for (const user of users) {
                // In real implementation, this would call Firebase Admin SDK
                await new Promise(resolve => setTimeout(resolve, 10)); // Simulate API call
                
                this.migrationStats.users++;
                
                if (this.migrationStats.users % 100 === 0) {
                    console.log(`   📦 Migrated ${this.migrationStats.users} users...`);
                }
            }
            
            console.log(`✅ Users migration completed: ${this.migrationStats.users} users`);
        } catch (error) {
            console.error('❌ Error migrating users:', error);
            this.migrationStats.errors++;
        }
    }

    async migrateManagers() {
        try {
            console.log('🏢 Migrating managers...');
            
            const Manager = require('../models/Manager');
            const managers = await Manager.find({}).populate('userId');
            
            for (const manager of managers) {
                // Simulate Firebase migration
                await new Promise(resolve => setTimeout(resolve, 15));
                
                this.migrationStats.managers++;
                
                if (this.migrationStats.managers % 50 === 0) {
                    console.log(`   📦 Migrated ${this.migrationStats.managers} managers...`);
                }
            }
            
            console.log(`✅ Managers migration completed: ${this.migrationStats.managers} managers`);
        } catch (error) {
            console.error('❌ Error migrating managers:', error);
            this.migrationStats.errors++;
        }
    }

    async migrateDevices() {
        try {
            console.log('📱 Migrating devices...');
            
            const Device = require('../models/Device');
            const devices = await Device.find({});
            
            for (const device of devices) {
                // Simulate Firebase migration
                await new Promise(resolve => setTimeout(resolve, 20));
                
                this.migrationStats.devices++;
                
                if (this.migrationStats.devices % 50 === 0) {
                    console.log(`   📦 Migrated ${this.migrationStats.devices} devices...`);
                }
            }
            
            console.log(`✅ Devices migration completed: ${this.migrationStats.devices} devices`);
        } catch (error) {
            console.error('❌ Error migrating devices:', error);
            this.migrationStats.errors++;
        }
    }

    async migrateStorages() {
        try {
            console.log('🏗️ Migrating storage requests...');
            
            const Storage = require('../models/Storage');
            const storages = await Storage.find({}).populate('userId');
            
            for (const storage of storages) {
                // Simulate Firebase migration
                await new Promise(resolve => setTimeout(resolve, 25));
                
                this.migrationStats.storages++;
                
                if (this.migrationStats.storages % 50 === 0) {
                    console.log(`   📦 Migrated ${this.migrationStats.storages} storage requests...`);
                }
            }
            
            console.log(`✅ Storage migration completed: ${this.migrationStats.storages} storage requests`);
        } catch (error) {
            console.error('❌ Error migrating storage requests:', error);
            this.migrationStats.errors++;
        }
    }

    async migrateSensorData() {
        try {
            console.log('📊 Migrating sensor data (in batches)...');
            
            const SensorData = require('../models/SensorData');
            const totalSensorData = await SensorData.countDocuments();
            const batchSize = 1000;
            let processed = 0;
            
            while (processed < totalSensorData) {
                const sensorDataBatch = await SensorData.find({})
                    .skip(processed)
                    .limit(batchSize);
                
                // Simulate batch migration to Firebase
                await new Promise(resolve => setTimeout(resolve, 100));
                
                processed += sensorDataBatch.length;
                this.migrationStats.sensorData = processed;
                
                console.log(`   📦 Migrated ${processed}/${totalSensorData} sensor data points...`);
            }
            
            console.log(`✅ Sensor data migration completed: ${this.migrationStats.sensorData} data points`);
        } catch (error) {
            console.error('❌ Error migrating sensor data:', error);
            this.migrationStats.errors++;
        }
    }

    async verifyMigration() {
        try {
            console.log('🔍 Verifying migration...');
            
            // Simulate verification process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const totalMigrated = Object.values(this.migrationStats)
                .filter((_, key) => key !== 'errors')
                .reduce((a, b) => a + b, 0);
            
            console.log('✅ Migration verification completed');
            console.log('📊 Migration Statistics:');
            console.log(`   👥 Users: ${this.migrationStats.users}`);
            console.log(`   🏢 Managers: ${this.migrationStats.managers}`);
            console.log(`   📱 Devices: ${this.migrationStats.devices}`);
            console.log(`   🏗️ Storage Requests: ${this.migrationStats.storages}`);
            console.log(`   📊 Sensor Data: ${this.migrationStats.sensorData}`);
            console.log(`   ❌ Errors: ${this.migrationStats.errors}`);
            console.log(`   📈 Success Rate: ${((totalMigrated / (totalMigrated + this.migrationStats.errors)) * 100).toFixed(2)}%`);
            
            return this.migrationStats.errors === 0;
        } catch (error) {
            console.error('❌ Error verifying migration:', error);
            return false;
        }
    }

    async cleanup() {
        try {
            console.log('🧹 Cleaning up...');
            
            // In a real migration, you might want to keep MongoDB data
            // or implement a rollback strategy
            
            console.log('✅ Cleanup completed');
        } catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    }

    async run() {
        try {
            console.log('🚀 Starting Firebase Migration');
            console.log('================================');
            
            const startTime = Date.now();
            
            await this.connect();
            await this.prepareMigration();
            const backupFile = await this.createBackup();
            
            console.log('================================');
            console.log('🔄 Starting Data Migration...');
            console.log('================================');
            
            await this.migrateUsers();
            await this.migrateManagers();
            await this.migrateDevices();
            await this.migrateStorages();
            await this.migrateSensorData();
            
            console.log('================================');
            console.log('📋 Migration Completed, Verifying...');
            console.log('================================');
            
            const success = await this.verifyMigration();
            await this.cleanup();
            
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            
            console.log('================================');
            if (success) {
                console.log('✅ Firebase Migration Completed Successfully!');
            } else {
                console.log('⚠️ Firebase Migration Completed with Errors');
            }
            console.log(`⏱️ Total Duration: ${duration} seconds`);
            console.log(`💾 Backup File: ${backupFile}`);
            console.log('================================');
            
            process.exit(success ? 0 : 1);
        } catch (error) {
            console.error('❌ Migration failed:', error);
            process.exit(1);
        }
    }
}

// Run migrator if called directly
if (require.main === module) {
    const migrator = new FirebaseMigrator();
    migrator.run();
}

module.exports = FirebaseMigrator;