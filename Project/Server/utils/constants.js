/**
 * Application Constants
 * Centralized constants for the entire application
 */

module.exports = {
    // Application Info
    APP_NAME: 'GrainZillow',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'IoT-based Grain Storage Management System',
    
    // Environment
    ENVIRONMENTS: {
        DEVELOPMENT: 'development',
        PRODUCTION: 'production',
        TEST: 'test'
    },
    
    // User Roles
    ROLES: {
        ADMIN: 'admin',
        MANAGER: 'manager',
        USER: 'user'
    },
    
    // Grain Types
    GRAIN_TYPES: [
        'wheat',
        'rice',
        'corn',
        'barley',
        'oats',
        'other'
    ],
    
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
    
    // Command Status
    COMMAND_STATUS: {
        PENDING: 'pending',
        EXECUTED: 'executed',
        FAILED: 'failed',
        CANCELLED: 'cancelled'
    },
    
    // Command Priority
    COMMAND_PRIORITY: {
        LOW: 'low',
        NORMAL: 'normal',
        HIGH: 'high',
        CRITICAL: 'critical'
    },
    
    // Notification Types
    NOTIFICATION_TYPES: {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        SUCCESS: 'success',
        ALERT: 'alert'
    },
    
    // Notification Categories
    NOTIFICATION_CATEGORIES: {
        SYSTEM: 'system',
        STORAGE: 'storage',
        DEVICE: 'device',
        SECURITY: 'security',
        USER: 'user',
        OTHER: 'other'
    },
    
    // Notification Priority
    NOTIFICATION_PRIORITY: {
        LOW: 'low',
        NORMAL: 'normal',
        HIGH: 'high',
        URGENT: 'urgent'
    },
    
    // Alert Types
    ALERT_TYPES: {
        HIGH_TEMPERATURE: 'high_temperature',
        LOW_TEMPERATURE: 'low_temperature',
        HIGH_HUMIDITY: 'high_humidity',
        GAS_LEAK: 'gas_leak',
        DEVICE_OFFLINE: 'device_offline'
    },
    
    // Sensor Thresholds (Default Values)
    SENSOR_THRESHOLDS: {
        TEMPERATURE: {
            MIN: 10,
            MAX: 40,
            CRITICAL_HIGH: 50,
            CRITICAL_LOW: -10
        },
        HUMIDITY: {
            MIN: 30,
            MAX: 70,
            CRITICAL_HIGH: 80,
            CRITICAL_LOW: 20
        },
        GAS_LEVEL: {
            MAX: 1000,
            CRITICAL: 2000
        }
    },
    
    // Pagination
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100
    },
    
    // File Upload
    FILE_UPLOAD: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
        ALLOWED_MIMETYPES: [
            'image/jpeg',
            'image/png',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
    },
    
    // Rate Limiting
    RATE_LIMITING: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100, // Limit each IP to 100 requests per windowMs
        AUTH_MAX_REQUESTS: 5 // Limit auth endpoints to 5 requests per windowMs
    },
    
    // JWT Configuration
    JWT: {
        EXPIRES_IN: '7d',
        ISSUER: 'GrainZillow',
        AUDIENCE: 'grainzillow-users'
    },
    
    // Password Policy
    PASSWORD_POLICY: {
        MIN_LENGTH: 6,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBER: true,
        REQUIRE_SYMBOL: false
    },
    
    // Storage Capacity
    STORAGE_CAPACITY: {
        MIN_CAPACITY: 1, // in units
        MAX_CAPACITY: 100000, // in units
        BUFFER_PERCENTAGE: 10 // 10% buffer for capacity calculations
    },
    
    // Date Formats
    DATE_FORMATS: {
        ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
        DISPLAY: 'DD/MM/YYYY HH:mm',
        DATE_ONLY: 'YYYY-MM-DD',
        TIME_ONLY: 'HH:mm:ss'
    },
    
    // Time Intervals (in milliseconds)
    TIME_INTERVALS: {
        SECOND: 1000,
        MINUTE: 60 * 1000,
        HOUR: 60 * 60 * 1000,
        DAY: 24 * 60 * 60 * 1000,
        WEEK: 7 * 24 * 60 * 60 * 1000
    },
    
    // HTTP Status Codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        CONFLICT: 409,
        UNPROCESSABLE_ENTITY: 422,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    },
    
    // Error Messages
    ERROR_MESSAGES: {
        // Authentication
        INVALID_CREDENTIALS: 'Invalid email or password',
        ACCESS_DENIED: 'Access denied. No token provided.',
        TOKEN_INVALID: 'Token is invalid',
        TOKEN_EXPIRED: 'Token has expired',
        UNAUTHORIZED_ACCESS: 'Unauthorized access',
        
        // Validation
        VALIDATION_FAILED: 'Validation failed',
        REQUIRED_FIELD: 'This field is required',
        INVALID_EMAIL: 'Please provide a valid email',
        INVALID_PHONE: 'Please provide a valid phone number',
        INVALID_PASSWORD: 'Password does not meet requirements',
        
        // User
        USER_NOT_FOUND: 'User not found',
        USER_EXISTS: 'User already exists with this email or username',
        USER_PENDING_APPROVAL: 'Account pending approval from manager',
        USER_DEACTIVATED: 'Account is deactivated',
        
        // Manager
        MANAGER_NOT_FOUND: 'Manager not found',
        MANAGER_EXISTS: 'User is already a manager',
        
        // Device
        DEVICE_NOT_FOUND: 'Device not found',
        DEVICE_OFFLINE: 'Device is offline and cannot receive commands',
        DEVICE_EXISTS: 'Device with this ID already exists',
        
        // Storage
        STORAGE_NOT_FOUND: 'Storage not found',
        INSUFFICIENT_CAPACITY: 'Insufficient storage capacity available',
        STORAGE_PENDING: 'Storage request is not in pending status',
        
        // General
        INTERNAL_ERROR: 'Internal server error',
        DATABASE_ERROR: 'Database operation failed',
        RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
        FILE_UPLOAD_ERROR: 'File upload failed',
        NOT_IMPLEMENTED: 'This feature is not implemented yet'
    },
    
    // Success Messages
    SUCCESS_MESSAGES: {
        // General
        OPERATION_SUCCESSFUL: 'Operation completed successfully',
        DATA_RETRIEVED: 'Data retrieved successfully',
        
        // User
        USER_CREATED: 'User registered successfully',
        USER_UPDATED: 'User updated successfully',
        USER_APPROVED: 'User approved successfully',
        USER_DELETED: 'User deleted successfully',
        
        // Manager
        MANAGER_CREATED: 'Manager created successfully',
        MANAGER_UPDATED: 'Manager updated successfully',
        
        // Device
        DEVICE_REGISTERED: 'Device registered successfully',
        DEVICE_UPDATED: 'Device updated successfully',
        COMMAND_SENT: 'Device command issued successfully',
        
        // Storage
        STORAGE_REQUESTED: 'Storage request submitted successfully',
        STORAGE_APPROVED: 'Storage request approved successfully',
        STORAGE_REJECTED: 'Storage request rejected successfully',
        STORAGE_COMPLETED: 'Storage completed successfully',
        
        // Authentication
        LOGIN_SUCCESSFUL: 'Login successful',
        LOGOUT_SUCCESSFUL: 'User logged out successfully',
        PASSWORD_UPDATED: 'Password updated successfully'
    },
    
    // API Routes
    API_ROUTES: {
        AUTH: '/api/auth',
        USERS: '/api/users',
        MANAGERS: '/api/managers',
        DEVICES: '/api/devices',
        DATA: '/api/data',
        STORAGE: '/api/storage',
        IOT: '/api/iot',
        NOTIFICATIONS: '/api/notifications'
    },
    
    // Default Configuration
    DEFAULTS: {
        // Device Configuration
        DEVICE_CONFIG: {
            TEMPERATURE_THRESHOLD: {
                MIN: 10,
                MAX: 40
            },
            HUMIDITY_THRESHOLD: {
                MIN: 30,
                MAX: 70
            },
            GAS_THRESHOLD: {
                MAX: 1000
            },
            SAMPLING_INTERVAL: 300, // 5 minutes in seconds
            AUTO_CONTROL: {
                FAN: false,
                PUMP: false,
                BUZZER: true
            }
        },
        
        // User Preferences
        USER_PREFERENCES: {
            NOTIFICATIONS: {
                EMAIL: true,
                PUSH: true,
                STORAGE_ALERTS: true,
                DEVICE_ALERTS: true,
                SYSTEM_MESSAGES: true,
                MARKETING: false
            },
            THEME: 'light',
            LANGUAGE: 'en'
        },
        
        // System Settings
        SYSTEM_SETTINGS: {
            MAINTENANCE_MODE: false,
            REGISTRATION_OPEN: true,
            AUTO_APPROVE_USERS: false,
            DATA_RETENTION_DAYS: 365
        }
    }
};