/**
 * Custom Validators
 * Additional validation functions beyond express-validator
 */

const { GRAIN_TYPES, ROLES, IOT_COMMANDS } = require('../config/constants');

// Validate grain type
exports.isValidGrainType = (grainType) => {
    return GRAIN_TYPES.includes(grainType);
};

// Validate user role
exports.isValidRole = (role) => {
    return Object.values(ROLES).includes(role);
};

// Validate IoT command
exports.isValidIoTCommand = (command) => {
    return Object.values(IOT_COMMANDS).includes(command);
};

// Validate storage capacity (positive number)
exports.isValidCapacity = (capacity) => {
    return typeof capacity === 'number' && capacity > 0;
};

// Validate quantity (positive number)
exports.isValidQuantity = (quantity) => {
    return typeof quantity === 'number' && quantity > 0;
};

// Validate temperature range
exports.isValidTemperature = (temperature) => {
    return typeof temperature === 'number' && temperature >= -50 && temperature <= 100;
};

// Validate humidity range
exports.isValidHumidity = (humidity) => {
    return typeof humidity === 'number' && humidity >= 0 && humidity <= 100;
};

// Validate gas level (non-negative)
exports.isValidGasLevel = (gasLevel) => {
    return typeof gasLevel === 'number' && gasLevel >= 0;
};

// Validate coordinates
exports.isValidCoordinates = (latitude, longitude) => {
    return typeof latitude === 'number' && 
           typeof longitude === 'number' &&
           latitude >= -90 && latitude <= 90 &&
           longitude >= -180 && longitude <= 180;
};

// Validate device ID format
exports.isValidDeviceId = (deviceId) => {
    const deviceIdRegex = /^ZILLOW_[A-Z0-9]+$/;
    return deviceIdRegex.test(deviceId);
};

// Validate manager ID format
exports.isValidManagerId = (managerId) => {
    const managerIdRegex = /^MGR\d{4}$/;
    return managerIdRegex.test(managerId);
};

// Validate storage ID format
exports.isValidStorageId = (storageId) => {
    const storageIdRegex = /^STR\d{4}$/;
    return storageIdRegex.test(storageId);
};

// Validate date range
exports.isValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return true; // Optional fields
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return start < end && start <= new Date();
};

// Validate duration (in days)
exports.isValidDuration = (duration) => {
    return typeof duration === 'number' && duration >= 1 && duration <= 365; // Max 1 year
};

// Validate password strength
exports.isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
};

// Validate phone number (Indian format)
exports.isValidIndianPhone = (phone) => {
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    return indianPhoneRegex.test(phone);
};

// Validate PIN code (Indian format)
exports.isValidIndianPincode = (pincode) => {
    const indianPincodeRegex = /^\d{6}$/;
    return indianPincodeRegex.test(pincode);
};

// Validate percentage
exports.isValidPercentage = (percentage) => {
    return typeof percentage === 'number' && percentage >= 0 && percentage <= 100;
};

// Validate file type
exports.isValidFileType = (filename, allowedTypes) => {
    if (!filename) return false;
    
    const extension = filename.split('.').pop().toLowerCase();
    return allowedTypes.includes(extension);
};

// Validate file size
exports.isValidFileSize = (fileSize, maxSizeInMB) => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return fileSize <= maxSizeInBytes;
};

// Validate JSON string
exports.isValidJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

// Validate MongoDB ObjectId
exports.isValidObjectId = (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
};

// Validate email domain
exports.isValidEmailDomain = (email, allowedDomains = []) => {
    if (allowedDomains.length === 0) return true;
    
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
};

// Validate business hours
exports.isValidBusinessHours = (timeString) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
};

// Validate currency amount
exports.isValidCurrency = (amount) => {
    return typeof amount === 'number' && amount >= 0;
};

// Validate rating (1-5)
exports.isValidRating = (rating) => {
    return typeof rating === 'number' && rating >= 1 && rating <= 5;
};

// Validate priority level
exports.isValidPriority = (priority) => {
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    return validPriorities.includes(priority);
};

// Validate notification type
exports.isValidNotificationType = (type) => {
    const validTypes = ['info', 'warning', 'error', 'success', 'alert'];
    return validTypes.includes(type);
};

// Validate status
exports.isValidStatus = (status, validStatuses) => {
    return validStatuses.includes(status);
};

// Validate array of values
exports.isValidArray = (array, validator) => {
    if (!Array.isArray(array)) return false;
    return array.every(item => validator(item));
};

// Validate object structure
exports.isValidObjectStructure = (obj, structure) => {
    for (const key in structure) {
        if (!obj.hasOwnProperty(key)) return false;
        if (typeof obj[key] !== structure[key]) return false;
    }
    return true;
};

// Validate required fields
exports.hasRequiredFields = (obj, requiredFields) => {
    for (const field of requiredFields) {
        if (!obj.hasOwnProperty(field) || obj[field] === null || obj[field] === undefined) {
            return false;
        }
    }
    return true;
};

// Validate optional fields type
exports.hasValidOptionalFields = (obj, fieldTypes) => {
    for (const field in fieldTypes) {
        if (obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined) {
            if (typeof obj[field] !== fieldTypes[field]) {
                return false;
            }
        }
    }
    return true;
};