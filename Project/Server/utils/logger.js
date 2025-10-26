const winston = require('winston');
const path = require('path');

/**
 * Logger Utility
 * Centralized logging configuration for the application
 */

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level}]: ${message}`;
        
        if (stack) {
            log += `\n${stack}`;
        }
        
        if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return log;
    })
);

// Create the logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'grainzillow-backend' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/error.log'), 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Custom stream for Morgan (HTTP logging)
logger.morganStream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

// Custom logging methods
logger.apiLog = (req, res, responseTime) => {
    const logData = {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user ? req.user.id : 'anonymous'
    };

    if (res.statusCode >= 400) {
        logger.warn('API Request', logData);
    } else {
        logger.info('API Request', logData);
    }
};

logger.databaseLog = (operation, collection, document, duration) => {
    logger.debug('Database Operation', {
        operation,
        collection,
        documentId: document?._id || 'unknown',
        duration: `${duration}ms`
    });
};

logger.securityLog = (event, user, details) => {
    logger.warn('Security Event', {
        event,
        user: user || 'unknown',
        details,
        timestamp: new Date().toISOString()
    });
};

logger.businessLog = (action, entity, entityId, user, details) => {
    logger.info('Business Action', {
        action,
        entity,
        entityId,
        user: user || 'system',
        details,
        timestamp: new Date().toISOString()
    });
};

logger.iotLog = (deviceId, event, data) => {
    logger.info('IoT Event', {
        deviceId,
        event,
        data,
        timestamp: new Date().toISOString()
    });
};

// Error logging helper
logger.logError = (error, context = {}) => {
    logger.error('Application Error', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...context
    });
};

// Request logging middleware
logger.requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.apiLog(req, res, duration);
    });
    
    next();
};

// Error logging middleware
logger.errorLogger = (err, req, res, next) => {
    logger.logError(err, {
        url: req.url,
        method: req.method,
        userId: req.user ? req.user.id : 'anonymous',
        ip: req.ip
    });
    
    next(err);
};

module.exports = logger;