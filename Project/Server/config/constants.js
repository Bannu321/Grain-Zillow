/**
 * Application Constants and Configuration
 */
module.exports = {
    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/grainzillow',
    
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'grainzillow-super-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    
    // Roles
    ROLES: {
        ADMIN: 'admin',
        MANAGER: 'manager',
        USER: 'user'
    },
    
    // Storage
    GRAIN_TYPES: ['wheat', 'rice', 'corn', 'barley', 'oats', 'other'],
    
    // Device Status
    DEVICE_STATUS: {
        ONLINE: 'online',
        OFFLINE: 'offline',
        MAINTENANCE: 'maintenance'
    },
    
    // Storage Request Status
    STORAGE_STATUS: {
        PENDING: 'pending',
        APPROVED: 'approved',
        REJECTED: 'rejected',
        ACTIVE: 'active',
        COMPLETED: 'completed'
    },
    
    // IoT Commands
    IOT_COMMANDS: {
        PUMP_ON: 'pump_on',
        PUMP_OFF: 'pump_off',
        FAN_ON: 'fan_on',
        FAN_OFF: 'fan_off',
        BUZZER_ON: 'buzzer_on',
        BUZZER_OFF: 'buzzer_off'
    },
    
    // Pagination
    DEFAULT_PAGE_LIMIT: 10,
    MAX_PAGE_LIMIT: 100
};