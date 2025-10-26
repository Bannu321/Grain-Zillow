const mongoose = require('mongoose');
const { MONGODB_URI } = require('./constants');

/**
 * Database Service - Handles MongoDB connection and provides abstraction for future Firebase migration
 */
class DatabaseService {
    constructor() {
        this.mongoose = mongoose;
        this.isConnected = false;
        this.db = null;
    }

    async connect() {
        try {
            await this.mongoose.connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            this.isConnected = true;
            this.db = this.mongoose.connection;
            console.log('✅ MongoDB connected successfully');
            
            // Set up connection event handlers
            this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
            this.db.on('disconnected', () => {
                console.log('MongoDB disconnected');
                this.isConnected = false;
            });
            
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.mongoose.disconnect();
            this.isConnected = false;
        }
    }

    // Method to facilitate future migration to Firebase
    async migrateToFirebase(collectionName) {
        console.log(`🔄 Starting migration for ${collectionName} to Firebase`);
        // Implementation for Firebase migration would go here
        // This provides a hook for future database migration
    }

    getConnection() {
        return this.db;
    }
}

// Export singleton instance
module.exports = new DatabaseService();