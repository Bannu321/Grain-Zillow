const Storage = require('../models/Storage');
const Manager = require('../models/Manager');
const NotificationService = require('./notificationService');

/**
 * Storage Service
 * Handles storage capacity management, allocation, and business logic
 */
class StorageService {
    constructor() {
        this.capacityBuffer = 0.1; // 10% buffer for capacity calculations
    }

    // Request new storage
    async requestStorage(userId, storageData) {
        try {
            const { managerId, capacity } = storageData;

            // Verify manager and capacity
            const manager = await Manager.findOne({ managerId, isActive: true });
            if (!manager) {
                throw new Error('Manager not found or inactive');
            }

            if (!manager.hasCapacity(capacity)) {
                throw new Error('Insufficient storage capacity available');
            }

            // Create storage request
            const storage = await Storage.create({
                ...storageData,
                userId,
                status: 'pending'
            });

            // Notify manager
            await NotificationService.sendNotification(
                manager.userId,
                {
                    title: 'New Storage Request',
                    message: `New storage request for ${storage.quantity}kg of ${storage.grainType} from user.`,
                    type: 'info',
                    category: 'storage',
                    priority: 'normal',
                    actionRequired: true,
                    actionUrl: `/manager/storage/pending`,
                    actionLabel: 'Review Request',
                    metadata: { storageId: storage.storageId }
                }
            );

            return storage;
        } catch (error) {
            console.error('Request storage error:', error);
            throw new Error(`Failed to request storage: ${error.message}`);
        }
    }

    // Approve storage request
    async approveStorage(storageId, approvedBy, notes = '') {
        try {
            const storage = await Storage.findOne({ storageId });
            if (!storage) {
                throw new Error('Storage request not found');
            }

            if (storage.status !== 'pending') {
                throw new Error('Storage request is not in pending status');
            }

            const manager = await Manager.findOne({ managerId: storage.managerId });
            if (!manager) {
                throw new Error('Associated manager not found');
            }

            // Check capacity again
            if (!manager.hasCapacity(storage.capacity)) {
                throw new Error('Insufficient capacity to approve this request');
            }

            // Allocate capacity
            await manager.allocateCapacity(storage.capacity);

            // Update storage status
            await storage.approveStorage();
            if (notes) {
                storage.notes = notes;
                await storage.save();
            }

            // Notify user
            await NotificationService.notifyStorageApproval(storage);

            return storage;
        } catch (error) {
            console.error('Approve storage error:', error);
            throw new Error(`Failed to approve storage: ${error.message}`);
        }
    }

    // Reject storage request
    async rejectStorage(storageId, rejectedBy, reason = '') {
        try {
            const storage = await Storage.findOne({ storageId });
            if (!storage) {
                throw new Error('Storage request not found');
            }

            storage.status = 'rejected';
            if (reason) {
                storage.notes = reason;
            }
            await storage.save();

            // Notify user
            await NotificationService.notifyStorageRejection(storage, reason);

            return storage;
        } catch (error) {
            console.error('Reject storage error:', error);
            throw new Error(`Failed to reject storage: ${error.message}`);
        }
    }

    // Complete storage (release capacity)
    async completeStorage(storageId, completedBy) {
        try {
            const storage = await Storage.findOne({ storageId });
            if (!storage) {
                throw new Error('Storage not found');
            }

            if (storage.status !== 'active') {
                throw new Error('Only active storage can be completed');
            }

            const manager = await Manager.findOne({ managerId: storage.managerId });
            if (!manager) {
                throw new Error('Associated manager not found');
            }

            // Release capacity
            await manager.releaseCapacity(storage.capacity);

            // Mark storage as completed
            await storage.completeStorage();

            // Notify user
            await NotificationService.sendNotification(
                storage.userId,
                {
                    title: 'Storage Completed',
                    message: `Your storage for ${storage.quantity}kg of ${storage.grainType} has been completed.`,
                    type: 'success',
                    category: 'storage',
                    priority: 'normal',
                    actionRequired: false,
                    metadata: { storageId: storage.storageId, action: 'completed' }
                }
            );

            return storage;
        } catch (error) {
            console.error('Complete storage error:', error);
            throw new Error(`Failed to complete storage: ${error.message}`);
        }
    }

    // Calculate storage utilization for a manager
    async calculateStorageUtilization(managerId) {
        try {
            const manager = await Manager.findOne({ managerId });
            if (!manager) {
                throw new Error('Manager not found');
            }

            const usedCapacity = await Storage.getUsedCapacity(managerId);
            const totalCapacity = manager.godown.totalCapacity;
            const availableCapacity = manager.godown.availableCapacity;

            const utilization = {
                managerId,
                godownName: manager.godown.name,
                totalCapacity,
                usedCapacity,
                availableCapacity,
                utilizationPercentage: ((usedCapacity / totalCapacity) * 100).toFixed(2),
                buffer: totalCapacity * this.capacityBuffer,
                recommended: {
                    maxUtilization: (totalCapacity * (1 - this.capacityBuffer)).toFixed(2),
                    isOverCapacity: usedCapacity > totalCapacity * (1 - this.capacityBuffer)
                }
            };

            return utilization;
        } catch (error) {
            console.error('Calculate storage utilization error:', error);
            throw new Error(`Failed to calculate storage utilization: ${error.message}`);
        }
    }

    // Get storage statistics for dashboard
    async getStorageStats(timeRange = '30d') {
        try {
            const days = this.parseTimeRange(timeRange);
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

            const [
                totalStorages,
                activeStorages,
                pendingRequests,
                grainStats,
                capacityStats
            ] = await Promise.all([
                Storage.countDocuments({ createdAt: { $gte: startDate } }),
                Storage.countDocuments({ 
                    status: { $in: ['approved', 'active'] },
                    createdAt: { $gte: startDate }
                }),
                Storage.countDocuments({ 
                    status: 'pending',
                    createdAt: { $gte: startDate }
                }),
                Storage.aggregate([
                    {
                        $match: { createdAt: { $gte: startDate } }
                    },
                    {
                        $group: {
                            _id: '$grainType',
                            count: { $sum: 1 },
                            totalQuantity: { $sum: '$quantity' },
                            totalCapacity: { $sum: '$capacity' }
                        }
                    }
                ]),
                Manager.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalCapacity: { $sum: '$godown.totalCapacity' },
                            availableCapacity: { $sum: '$godown.availableCapacity' }
                        }
                    }
                ])
            ]);

            const capacity = capacityStats[0] || { totalCapacity: 0, availableCapacity: 0 };

            return {
                period: { startDate, endDate: new Date(), days },
                overview: {
                    totalStorages,
                    activeStorages,
                    pendingRequests,
                    completionRate: totalStorages > 0 ? ((activeStorages / totalStorages) * 100).toFixed(2) : 0
                },
                capacity: {
                    total: capacity.totalCapacity,
                    used: capacity.totalCapacity - capacity.availableCapacity,
                    available: capacity.availableCapacity,
                    utilization: capacity.totalCapacity > 0 ? 
                        (((capacity.totalCapacity - capacity.availableCapacity) / capacity.totalCapacity) * 100).toFixed(2) : 0
                },
                grainBreakdown: grainStats.reduce((acc, stat) => {
                    acc[stat._id] = {
                        count: stat.count,
                        totalQuantity: stat.totalQuantity,
                        totalCapacity: stat.totalCapacity
                    };
                    return acc;
                }, {})
            };
        } catch (error) {
            console.error('Get storage stats error:', error);
            throw new Error('Failed to get storage statistics');
        }
    }

    // Check storage expiration and send notifications
    async checkStorageExpirations() {
        try {
            const expiringSoon = await Storage.find({
                status: 'active',
                'duration.endDate': {
                    $gte: new Date(),
                    $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                }
            }).populate('userId').populate('managerId');

            const notifications = [];

            for (const storage of expiringSoon) {
                const daysUntilExpiry = Math.ceil((storage.duration.endDate - new Date()) / (24 * 60 * 60 * 1000));
                
                // Notify user
                notifications.push(
                    NotificationService.sendNotification(
                        storage.userId._id,
                        {
                            title: 'Storage Expiring Soon',
                            message: `Your storage for ${storage.quantity}kg of ${storage.grainType} will expire in ${daysUntilExpiry} days.`,
                            type: 'warning',
                            category: 'storage',
                            priority: 'normal',
                            actionRequired: true,
                            actionUrl: `/storage/${storage.storageId}`,
                            actionLabel: 'View Storage',
                            metadata: { 
                                storageId: storage.storageId, 
                                daysUntilExpiry,
                                expiryDate: storage.duration.endDate 
                            }
                        }
                    )
                );

                // Notify manager
                notifications.push(
                    NotificationService.sendNotification(
                        storage.managerId.userId,
                        {
                            title: 'Storage Expiring Soon',
                            message: `Storage for ${storage.quantity}kg of ${storage.grainType} will expire in ${daysUntilExpiry} days.`,
                            type: 'info',
                            category: 'storage',
                            priority: 'normal',
                            actionRequired: false,
                            metadata: { 
                                storageId: storage.storageId,
                                daysUntilExpiry,
                                expiryDate: storage.duration.endDate
                            }
                        }
                    )
                );
            }

            await Promise.all(notifications);

            return {
                checked: expiringSoon.length,
                notifications: notifications.length
            };
        } catch (error) {
            console.error('Check storage expirations error:', error);
            throw new Error('Failed to check storage expirations');
        }
    }

    // Update storage quality metrics
    async updateQualityMetrics(storageId, qualityMetrics, updatedBy) {
        try {
            const storage = await Storage.findOne({ storageId });
            if (!storage) {
                throw new Error('Storage not found');
            }

            storage.qualityMetrics = {
                ...storage.qualityMetrics,
                ...qualityMetrics,
                lastChecked: new Date(),
                checkedBy: updatedBy
            };

            await storage.save();

            // Check if quality metrics indicate issues
            await this.checkQualityIssues(storage);

            return storage;
        } catch (error) {
            console.error('Update quality metrics error:', error);
            throw new Error(`Failed to update quality metrics: ${error.message}`);
        }
    }

    // Check for quality issues and send alerts
    async checkQualityIssues(storage) {
        try {
            const { qualityMetrics } = storage;
            const issues = [];

            if (qualityMetrics.moistureContent > 14) { // Example threshold
                issues.push('High moisture content detected');
            }

            if (qualityMetrics.foreignMaterial > 2) { // Example threshold
                issues.push('High foreign material content detected');
            }

            if (qualityMetrics.temperature > 25) { // Example threshold
                issues.push('High storage temperature detected');
            }

            if (issues.length > 0) {
                await NotificationService.sendNotification(
                    storage.userId,
                    {
                        title: 'Storage Quality Alert',
                        message: `Quality issues detected in your ${storage.grainType} storage: ${issues.join(', ')}`,
                        type: 'warning',
                        category: 'storage',
                        priority: 'high',
                        actionRequired: true,
                        actionUrl: `/storage/${storage.storageId}`,
                        actionLabel: 'View Storage',
                        metadata: { 
                            storageId: storage.storageId,
                            issues,
                            qualityMetrics 
                        }
                    }
                );

                // Also notify manager
                const manager = await Manager.findOne({ managerId: storage.managerId });
                if (manager) {
                    await NotificationService.sendNotification(
                        manager.userId,
                        {
                            title: 'Storage Quality Alert',
                            message: `Quality issues detected in storage ${storage.storageId}: ${issues.join(', ')}`,
                            type: 'warning',
                            category: 'storage',
                            priority: 'normal',
                            actionRequired: true,
                            metadata: { 
                                storageId: storage.storageId,
                                issues,
                                qualityMetrics 
                            }
                        }
                    );
                }
            }

            return issues;
        } catch (error) {
            console.error('Check quality issues error:', error);
            throw new Error('Failed to check quality issues');
        }
    }

    // Get storage recommendations based on utilization
    async getStorageRecommendations(managerId) {
        try {
            const utilization = await this.calculateStorageUtilization(managerId);
            const recommendations = [];

            if (utilization.recommended.isOverCapacity) {
                recommendations.push({
                    type: 'warning',
                    message: 'Storage capacity exceeded recommended limit',
                    suggestion: 'Consider expanding capacity or optimizing storage allocation'
                });
            }

            if (utilization.utilizationPercentage > 80) {
                recommendations.push({
                    type: 'info',
                    message: 'Storage utilization is high',
                    suggestion: 'Monitor capacity closely and plan for future expansion'
                });
            }

            if (utilization.utilizationPercentage < 20) {
                recommendations.push({
                    type: 'info', 
                    message: 'Storage utilization is low',
                    suggestion: 'Consider marketing available storage space to attract more users'
                });
            }

            return {
                managerId,
                utilization: utilization.utilizationPercentage,
                recommendations
            };
        } catch (error) {
            console.error('Get storage recommendations error:', error);
            throw new Error('Failed to get storage recommendations');
        }
    }

    // Private method to parse time range
    parseTimeRange(timeRange) {
        const ranges = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365
        };

        return ranges[timeRange] || 30;
    }

    // Start background tasks
    startBackgroundTasks() {
        // Check storage expirations daily
        setInterval(async () => {
            try {
                await this.checkStorageExpirations();
            } catch (error) {
                console.error('Background storage expiration check error:', error);
            }
        }, 24 * 60 * 60 * 1000); // Daily

        console.log('📦 Storage Service background tasks started');
    }
}

module.exports = new StorageService();