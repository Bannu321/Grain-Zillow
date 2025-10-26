const Manager = require('../models/Manager');
const Storage = require('../models/Storage');
const Device = require('../models/Device');

/**
 * Helper Utilities
 * Common utility functions used throughout the application
 */

// Generate unique IDs for various entities
exports.generateUniqueId = async (prefix) => {
    let uniqueId;
    let exists = true;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (exists && attempts < maxAttempts) {
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 1000-9999
        uniqueId = `${prefix}${randomNum}`;
        
        // Check if ID exists in relevant collection
        if (prefix === 'MGR') {
            exists = await Manager.findOne({ managerId: uniqueId });
        } else if (prefix === 'STR') {
            exists = await Storage.findOne({ storageId: uniqueId });
        } else if (prefix === 'DEV') {
            exists = await Device.findOne({ deviceId: uniqueId });
        } else {
            exists = false; // Unknown prefix, assume unique
        }
        
        attempts++;
    }
    
    if (attempts >= maxAttempts) {
        throw new Error(`Could not generate unique ID after ${maxAttempts} attempts`);
    }
    
    return uniqueId;
};

// Format response data
exports.formatResponse = (success, message, data = null, error = null) => {
    const response = {
        success,
        message,
        timestamp: new Date().toISOString()
    };
    
    if (data !== null) {
        response.data = data;
    }
    
    if (error !== null && process.env.NODE_ENV === 'development') {
        response.error = error;
    }
    
    return response;
};

// Validate email format
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (basic validation)
exports.isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

// Sanitize input data
exports.sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/[<>]/g, '');
    }
    return input;
};

// Generate random password
exports.generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
};

// Calculate distance between two coordinates (Haversine formula)
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance; // in kilometers
};

// Format file size
exports.formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate pagination metadata
exports.generatePagination = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
    };
};

// Deep clone object
exports.deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => exports.deepClone(item));
    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = exports.deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
};

// Debounce function
exports.debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
exports.throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Generate CSV from array of objects
exports.arrayToCSV = (data, headers = null) => {
    if (!data || data.length === 0) return '';
    
    const actualHeaders = headers || Object.keys(data[0]);
    const csvRows = [actualHeaders.join(',')];
    
    for (const row of data) {
        const values = actualHeaders.map(header => {
            const value = row[header];
            // Handle values that might contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value !== undefined && value !== null ? value : '';
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
};

// Parse CSV to array of objects
exports.csvToArray = (csvString) => {
    const lines = csvString.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => {
            // Remove quotes and handle escaped quotes
            let cleaned = value.trim();
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                cleaned = cleaned.slice(1, -1).replace(/""/g, '"');
            }
            return cleaned;
        });
        
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });
        result.push(obj);
    }
    
    return result;
};

// Generate random color (for charts etc.)
exports.generateRandomColor = (opacity = 1) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Format currency
exports.formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Calculate percentage
exports.calculatePercentage = (part, total) => {
    if (total === 0) return 0;
    return ((part / total) * 100).toFixed(2);
};

// Sleep/delay function
exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Validate URL
exports.isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// Extract domain from URL
exports.extractDomain = (url) => {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
    } catch (_) {
        return null;
    }
};

// Generate OTP (One Time Password)
exports.generateOTP = (length = 6) => {
    const digits = '0123456789';
    let OTP = '';
    
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    
    return OTP;
};

// Check if value is empty (null, undefined, empty string, empty array, empty object)
exports.isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

// Capitalize first letter of each word
exports.capitalizeWords = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

// Convert camelCase to snake_case
exports.camelToSnake = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Convert snake_case to camelCase
exports.snakeToCamel = (str) => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Generate timestamp string
exports.generateTimestamp = () => {
    return new Date().toISOString().replace(/[:.]/g, '-');
};

// Validate Indian PIN code
exports.isValidPincode = (pincode) => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
};

// Calculate age from birth date
exports.calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
};

// Group array of objects by key
exports.groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};

// Flatten nested array
exports.flattenArray = (array) => {
    return array.reduce((flat, item) => {
        return flat.concat(Array.isArray(item) ? exports.flattenArray(item) : item);
    }, []);
};

// Remove duplicates from array
exports.removeDuplicates = (array, key = null) => {
    if (key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }
    return [...new Set(array)];
};

// Sort array of objects by key
exports.sortBy = (array, key, order = 'asc') => {
    return array.sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
        
        // Handle nested keys (e.g., 'user.profile.name')
        if (key.includes('.')) {
            const keys = key.split('.');
            aValue = keys.reduce((obj, k) => obj?.[k], a);
            bValue = keys.reduce((obj, k) => obj?.[k], b);
        }
        
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

// Mask sensitive data (e.g., email, phone)
exports.maskSensitiveData = (data, type) => {
    switch (type) {
        case 'email':
            const [local, domain] = data.split('@');
            const maskedLocal = local.length > 2 ? 
                local.substring(0, 2) + '*'.repeat(local.length - 2) : 
                '*'.repeat(local.length);
            return `${maskedLocal}@${domain}`;
            
        case 'phone':
            return data.replace(/\d(?=\d{4})/g, '*');
            
        case 'creditCard':
            return data.replace(/\d(?=\d{4})/g, '*');
            
        default:
            return data;
    }
};

// Generate slug from string
exports.generateSlug = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Parse query string to object
exports.parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params) {
        // Handle arrays (e.g., ?status=pending&status=approved)
        if (result[key]) {
            if (Array.isArray(result[key])) {
                result[key].push(value);
            } else {
                result[key] = [result[key], value];
            }
        } else {
            result[key] = value;
        }
    }
    
    return result;
};

// Stringify object to query string
exports.stringifyQuery = (obj) => {
    const params = new URLSearchParams();
    
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
        } else if (value !== null && value !== undefined) {
            params.append(key, value.toString());
        }
    }
    
    return params.toString();
};