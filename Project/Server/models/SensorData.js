const mongoose = require('mongoose');

/**
 * SensorData Model - Time-series data from IoT devices
 */
const sensorDataSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: [true, 'Device ID is required'],
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    temperature: {
        value: {
            type: Number,
            required: [true, 'Temperature value is required'],
            min: [-50, 'Temperature too low'],
            max: [100, 'Temperature too high']
        },
        unit: {
            type: String,
            default: 'C'
        }
    },
    humidity: {
        value: {
            type: Number,
            required: [true, 'Humidity value is required'],
            min: [0, 'Humidity cannot be negative'],
            max: [100, 'Humidity cannot exceed 100%']
        },
        unit: {
            type: String,
            default: '%'
        }
    },
    gasLevel: {
        value: {
            type: Number,
            required: [true, 'Gas level value is required'],
            min: [0, 'Gas level cannot be negative']
        },
        unit: {
            type: String,
            default: 'ppm'
        }
    },
    coordinates: {
        latitude: {
            type: Number,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            min: -180,
            max: 180
        }
    },
    status: {
        type: String,
        enum: ['normal', 'warning', 'critical'],
        default: 'normal'
    },
    alerts: [{
        type: {
            type: String,
            enum: ['high_temperature', 'low_temperature', 'high_humidity', 'gas_leak', 'device_offline']
        },
        message: String,
        threshold: Number,
        value: Number,
        triggeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    metadata: mongoose.Schema.Types.Mixed
}, {
    // Enable timeseries for efficient time-based queries
    timeseries: {
        timeField: 'timestamp',
        metaField: 'deviceId',
        granularity: 'hours'
    },
    autoCreate: false
});

// Compound indexes for efficient querying
sensorDataSchema.index({ deviceId: 1, timestamp: -1 });
sensorDataSchema.index({ timestamp: -1 });
sensorDataSchema.index({ status: 1, timestamp: -1 });

// Virtual for isCritical status
sensorDataSchema.virtual('isCritical').get(function() {
    return this.status === 'critical';
});

// Static method to get latest data for a device
sensorDataSchema.statics.getLatestByDevice = function(deviceId) {
    return this.findOne({ deviceId })
        .sort({ timestamp: -1 })
        .limit(1);
};

// Static method to get data within time range
sensorDataSchema.statics.getByTimeRange = function(deviceId, startTime, endTime) {
    return this.find({
        deviceId,
        timestamp: {
            $gte: startTime,
            $lte: endTime
        }
    }).sort({ timestamp: 1 });
};

// Static method to get critical alerts
sensorDataSchema.statics.getCriticalAlerts = function(deviceId, hours = 24) {
    const startTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
    
    return this.find({
        deviceId,
        status: 'critical',
        timestamp: { $gte: startTime }
    }).sort({ timestamp: -1 });
};

// Static method to calculate averages
sensorDataSchema.statics.getAverages = async function(deviceId, hours = 24) {
    const startTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
    
    const result = await this.aggregate([
        {
            $match: {
                deviceId,
                timestamp: { $gte: startTime }
            }
        },
        {
            $group: {
                _id: null,
                avgTemperature: { $avg: '$temperature.value' },
                avgHumidity: { $avg: '$humidity.value' },
                avgGasLevel: { $avg: '$gasLevel.value' },
                maxTemperature: { $max: '$temperature.value' },
                minTemperature: { $min: '$temperature.value' },
                dataPoints: { $sum: 1 }
            }
        }
    ]);
    
    return result.length > 0 ? result[0] : null;
};

// Method to check if data indicates critical conditions
sensorDataSchema.methods.checkAlerts = function() {
    const alerts = [];
    
    if (this.temperature.value > 50) {
        alerts.push({
            type: 'high_temperature',
            message: `High temperature detected: ${this.temperature.value}°C`,
            threshold: 50,
            value: this.temperature.value
        });
        this.status = 'critical';
    }
    
    if (this.gasLevel.value > 1000) {
        alerts.push({
            type: 'gas_leak',
            message: `Gas leak detected: ${this.gasLevel.value} ppm`,
            threshold: 1000,
            value: this.gasLevel.value
        });
        this.status = 'critical';
    }
    
    if (this.humidity.value > 80) {
        alerts.push({
            type: 'high_humidity',
            message: `High humidity detected: ${this.humidity.value}%`,
            threshold: 80,
            value: this.humidity.value
        });
        this.status = this.status === 'normal' ? 'warning' : this.status;
    }
    
    if (alerts.length > 0) {
        this.alerts = alerts;
    }
    
    return alerts;
};

module.exports = mongoose.model('SensorData', sensorDataSchema);