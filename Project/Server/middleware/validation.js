const { body, param, query, validationResult } = require('express-validator');
const { ROLES, GRAIN_TYPES, IOT_COMMANDS } = require('../config/constants');

/**
 * Validation Middleware
 * Provides request validation rules and error handling
 */

// Generic validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Authentication validations
const validateRegistration = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .isAlphanumeric()
        .withMessage('Username must contain only letters and numbers')
        .trim(),
    
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('profile.firstName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters')
        .trim(),
    
    body('profile.lastName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters')
        .trim(),
    
    body('profile.phone')
        .optional()
        .matches(/^\d{10}$/)
        .withMessage('Please provide a valid 10-digit phone number'),
    
    handleValidationErrors
];

const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

const validatePasswordUpdate = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    handleValidationErrors
];

// Sensor data validations
const validateSensorData = [
    body('deviceId')
        .notEmpty()
        .withMessage('Device ID is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Device ID must be between 3 and 50 characters'),
    
    body('temperature.value')
        .isFloat({ min: -50, max: 100 })
        .withMessage('Temperature must be between -50 and 100°C'),
    
    body('humidity.value')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Humidity must be between 0 and 100%'),
    
    body('gasLevel.value')
        .isFloat({ min: 0 })
        .withMessage('Gas level cannot be negative'),
    
    body('coordinates.latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),
    
    body('coordinates.longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),
    
    handleValidationErrors
];

// Storage validations
const validateStorageRequest = [
    body('managerId')
        .notEmpty()
        .withMessage('Manager ID is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Manager ID must be between 3 and 20 characters'),
    
    body('grainType')
        .isIn(GRAIN_TYPES)
        .withMessage(`Grain type must be one of: ${GRAIN_TYPES.join(', ')}`),
    
    body('quantity')
        .isFloat({ min: 1 })
        .withMessage('Quantity must be at least 1 kg'),
    
    body('capacity')
        .isFloat({ min: 1 })
        .withMessage('Capacity must be at least 1 unit'),
    
    body('duration.plannedDuration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Planned duration must be at least 1 day'),
    
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters'),
    
    handleValidationErrors
];

// Device control validations
const validateDeviceControl = [
    body('deviceId')
        .notEmpty()
        .withMessage('Device ID is required'),
    
    body('command')
        .isIn(Object.values(IOT_COMMANDS))
        .withMessage(`Command must be one of: ${Object.values(IOT_COMMANDS).join(', ')}`),
    
    body('metadata.duration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive integer'),
    
    handleValidationErrors
];

// Manager creation validations
const validateManagerCreation = [
    body('userId')
        .isMongoId()
        .withMessage('Valid User ID is required'),
    
    body('godown.name')
        .notEmpty()
        .withMessage('Godown name is required')
        .isLength({ max: 100 })
        .withMessage('Godown name cannot exceed 100 characters'),
    
    body('godown.location.address')
        .notEmpty()
        .withMessage('Godown address is required'),
    
    body('godown.totalCapacity')
        .isFloat({ min: 1 })
        .withMessage('Total capacity must be at least 1 unit'),
    
    body('contact.phone')
        .optional()
        .matches(/^\d{10}$/)
        .withMessage('Please provide a valid 10-digit phone number'),
    
    handleValidationErrors
];

// Device registration validations
const validateDeviceRegistration = [
    body('deviceId')
        .matches(/^ZILLOW_[A-Z0-9]+$/)
        .withMessage('Device ID must start with ZILLOW_ followed by uppercase letters and numbers'),
    
    body('name')
        .notEmpty()
        .withMessage('Device name is required')
        .isLength({ max: 100 })
        .withMessage('Device name cannot exceed 100 characters'),
    
    body('managerId')
        .notEmpty()
        .withMessage('Manager ID is required'),
    
    body('location')
        .notEmpty()
        .withMessage('Location is required'),
    
    body('configuration.temperatureThreshold.min')
        .optional()
        .isFloat({ min: -50, max: 100 })
        .withMessage('Min temperature threshold must be between -50 and 100'),
    
    body('configuration.temperatureThreshold.max')
        .optional()
        .isFloat({ min: -50, max: 100 })
        .withMessage('Max temperature threshold must be between -50 and 100'),
    
    handleValidationErrors
];

// Query parameter validations
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
];

const validateDateRange = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date'),
    
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateRegistration,
    validateLogin,
    validatePasswordUpdate,
    validateSensorData,
    validateStorageRequest,
    validateDeviceControl,
    validateManagerCreation,
    validateDeviceRegistration,
    validatePagination,
    validateDateRange
};