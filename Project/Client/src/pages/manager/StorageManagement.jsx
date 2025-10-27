import React, { useState, useEffect } from 'react';
import storageService from '../../services/storageService';
import toast from 'react-hot-toast';

const StorageManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [storageRequests, setStorageRequests] = useState([]);
  const [godownInfo, setGodownInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Grain type badge colors
  const grainColors = {
    wheat: 'bg-yellow-100 text-yellow-800',
    rice: 'bg-gray-100 text-gray-800',
    corn: 'bg-orange-100 text-orange-800',
    barley: 'bg-yellow-50 text-yellow-900',
    oats: 'bg-green-100 text-green-800',
    other: 'bg-blue-100 text-blue-800'
  };

  // Fetch storage requests
  const fetchStorageRequests = async () => {
    const result = await storageService.getStorageRequests();
    if (result.success) {
      setStorageRequests(result.data || []);
    } else {
      toast.error('Failed to load storage requests');
    }
  };

  // Fetch godown information
  const fetchGodownInfo = async () => {
    const result = await storageService.getManagerGodown();
    if (result.success) {
      setGodownInfo(result.data);
    } else {
      toast.error('Failed to load godown information');
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStorageRequests(), fetchGodownInfo()]);
      setLoading(false);
    };

    loadData();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchStorageRequests();
      fetchGodownInfo();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter storage by status
  const getFilteredStorage = () => {
    if (activeTab === 'pending') {
      return storageRequests.filter((s) => s.status === 'pending');
    } else if (activeTab === 'approved') {
      return storageRequests.filter((s) => s.status === 'approved');
    } else if (activeTab === 'active') {
      return storageRequests.filter((s) => s.status === 'active');
    }
    return [];
  };

  // Handle storage approval
  const handleApprove = async (storageId, capacityNeeded) => {
    // Check if sufficient capacity
    if (godownInfo && godownInfo.availableCapacity < capacityNeeded) {
      toast.error(`Insufficient capacity - ${godownInfo.availableCapacity} m³ available, ${capacityNeeded} m³ needed`);
      return;
    }

    setActionLoading(`approve_${storageId}`);
    const result = await storageService.approveStorage(storageId);

    if (result.success) {
      toast.success('Storage request approved successfully');
      // Refresh data
      fetchStorageRequests();
      fetchGodownInfo();
    } else {
      toast.error(result.message || 'Failed to approve storage request');
    }

    setActionLoading(null);
  };

  // Open reject modal
  const openRejectModal = (storage) => {
    setSelectedStorage(storage);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  // Handle storage rejection
  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      toast.error('Please provide a rejection reason (min 10 characters)');
      return;
    }

    setActionLoading(`reject_${selectedStorage._id}`);
    const result = await storageService.rejectStorage(selectedStorage._id, rejectionReason);

    if (result.success) {
      toast.success('Storage request rejected successfully');
      // Refresh data
      fetchStorageRequests();
      setShowRejectModal(false);
      setSelectedStorage(null);
      setRejectionReason('');
    } else {
      toast.error(result.message || 'Failed to reject storage request');
    }

    setActionLoading(null);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate capacity percentage
  const getCapacityPercentage = () => {
    if (!godownInfo) return 0;
    const used = godownInfo.totalCapacity - godownInfo.availableCapacity;
    return (used / godownInfo.totalCapacity) * 100;
  };

  // Get capacity bar color
  const getCapacityColor = () => {
    const percentage = getCapacityPercentage();
    if (percentage < 70) return 'bg-grain-green';
    if (percentage < 90) return 'bg-grain-yellow';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grain-green"></div>
      </div>
    );
  }

  const filteredStorage = getFilteredStorage();

  return (
    <div className="space-y-6">
      {/* Capacity Widget */}
      {godownInfo && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Godown Capacity</h3>
              <p className="text-sm text-gray-600">{godownInfo.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-grain-green">
                {godownInfo.availableCapacity} m³
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getCapacityColor()} transition-all duration-300`}
              style={{ width: `${getCapacityPercentage()}%` }}
            ></div>
          </div>

          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Total: {godownInfo.totalCapacity} m³</span>
            <span>
              Used: {godownInfo.totalCapacity - godownInfo.availableCapacity} m³ (
              {getCapacityPercentage().toFixed(1)}%)
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-grain-green text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Pending Requests ({storageRequests.filter((s) => s.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'approved'
              ? 'bg-grain-green text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Approved ({storageRequests.filter((s) => s.status === 'approved').length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-grain-green text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Active Storage ({storageRequests.filter((s) => s.status === 'active').length})
        </button>
      </div>

      {/* Storage List */}
      <div className="space-y-4">
        {filteredStorage.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-gray-500 text-lg">
              {activeTab === 'pending' && 'No pending storage requests'}
              {activeTab === 'approved' && 'No approved storage'}
              {activeTab === 'active' && 'No active storage'}
            </p>
          </div>
        ) : (
          filteredStorage.map((storage) => {
            const user = storage.userId || storage.user || {};
            const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User';
            const grainType = storage.grainType || 'other';
            const capacityNeeded = storage.capacity || 0;
            const insufficientCapacity = godownInfo && godownInfo.availableCapacity < capacityNeeded;

            return (
              <div
                key={storage._id}
                className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-grain-green transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Storage Icon and Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-grain-cream flex items-center justify-center text-3xl">
                      🌾
                    </div>

                    {/* Storage Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-800">{userName}</h3>
                        <span
                          className={`px-3 py-1 text-xs font-semibold ${
                            grainColors[grainType] || grainColors.other
                          } rounded-full capitalize`}
                        >
                          {grainType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">{storage.quantity || 0} kg</span> •{' '}
                        <span className="font-semibold">{capacityNeeded} m³</span> capacity needed
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Requested: {formatDate(storage.requestDate || storage.createdAt)} •{' '}
                        <span className="capitalize">
                          {storage.status === 'pending' && 'Pending Approval'}
                          {storage.status === 'approved' && 'Approved'}
                          {storage.status === 'active' && 'Currently Active'}
                        </span>
                      </p>
                      {activeTab === 'pending' && insufficientCapacity && (
                        <p className="text-xs text-red-600 font-semibold mt-2">
                          ⚠️ Insufficient capacity - {godownInfo.availableCapacity} m³ available, {capacityNeeded} m³ needed
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons (only for pending) */}
                  {activeTab === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(storage._id, capacityNeeded)}
                        disabled={
                          actionLoading === `approve_${storage._id}` || insufficientCapacity
                        }
                        className="px-5 py-2 bg-grain-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                      >
                        {actionLoading === `approve_${storage._id}` ? (
                          'Approving...'
                        ) : (
                          <>
                            <span className="mr-1">✓</span> Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openRejectModal(storage)}
                        disabled={actionLoading === `reject_${storage._id}`}
                        className="px-5 py-2 bg-grain-yellow text-gray-800 rounded-lg hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                      >
                        <span className="mr-1">✗</span> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowRejectModal(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Reject Storage Request
              </h3>

              <p className="text-gray-600 mb-2">
                Request details:
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <p><span className="font-semibold">Grain Type:</span> <span className="capitalize">{selectedStorage?.grainType}</span></p>
                <p><span className="font-semibold">Quantity:</span> {selectedStorage?.quantity} kg</p>
                <p><span className="font-semibold">Capacity:</span> {selectedStorage?.capacity} m³</p>
              </div>

              {/* Rejection reason */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason * (minimum 10 characters)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {rejectionReason.length} / 10 characters
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedStorage(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading === `reject_${selectedStorage?._id}`}
                  className="flex-1 px-4 py-2 bg-grain-yellow text-gray-800 rounded-lg hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {actionLoading === `reject_${selectedStorage?._id}`
                    ? 'Rejecting...'
                    : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StorageManagement;
