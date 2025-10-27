import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch pending users
  const fetchPendingUsers = async () => {
    const result = await userService.getPendingApprovals();
    if (result.success) {
      setPendingUsers(result.data || []);
    } else {
      toast.error('Failed to load pending users');
    }
  };

  // Fetch approved users
  const fetchApprovedUsers = async () => {
    const result = await userService.getAllUsers({ isApproved: true });
    if (result.success) {
      setApprovedUsers(result.data || []);
    } else {
      toast.error('Failed to load approved users');
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPendingUsers(), fetchApprovedUsers()]);
      setLoading(false);
    };

    loadData();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchPendingUsers();
      fetchApprovedUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle user approval
  const handleApprove = async (userId) => {
    setActionLoading(`approve_${userId}`);
    const result = await userService.approveUser(userId);

    if (result.success) {
      toast.success('User approved successfully');
      // Remove from pending list
      setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
      // Refresh approved list
      fetchApprovedUsers();
    } else {
      toast.error(result.message || 'Failed to approve user');
    }

    setActionLoading(null);
  };

  // Open reject modal
  const openRejectModal = (user) => {
    setSelectedUser(user);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  // Handle user rejection
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(`reject_${selectedUser._id}`);
    const result = await userService.rejectUser(selectedUser._id, rejectionReason);

    if (result.success) {
      toast.success('User rejected successfully');
      // Remove from pending list
      setPendingUsers(pendingUsers.filter((user) => user._id !== selectedUser._id));
      setShowRejectModal(false);
      setSelectedUser(null);
      setRejectionReason('');
    } else {
      toast.error(result.message || 'Failed to reject user');
    }

    setActionLoading(null);
  };

  // Get user initials
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grain-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          Pending Requests ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'approved'
              ? 'bg-grain-green text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Approved Users ({approvedUsers.length})
        </button>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {activeTab === 'pending' ? (
          pendingUsers.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-md">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-500 text-lg">No pending approvals</p>
            </div>
          ) : (
            pendingUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-grain-green transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* User Avatar */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-grain-green text-white flex items-center justify-center text-xl font-bold">
                      {getInitials(user.firstName, user.lastName)}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-800">
                          {user.firstName} {user.lastName}
                        </h3>
                        <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {user.email} • {user.phone || 'No phone'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="capitalize">{user.role}</span> • Registered: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(user._id)}
                      disabled={actionLoading === `approve_${user._id}`}
                      className="px-5 py-2 bg-grain-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                    >
                      {actionLoading === `approve_${user._id}` ? (
                        'Approving...'
                      ) : (
                        <>
                          <span className="mr-1">✓</span> Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openRejectModal(user)}
                      disabled={actionLoading === `reject_${user._id}`}
                      className="px-5 py-2 bg-grain-yellow text-gray-800 rounded-lg hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                    >
                      <span className="mr-1">✗</span> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : approvedUsers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <span className="text-6xl mb-4 block">👥</span>
            <p className="text-gray-500 text-lg">No approved users yet</p>
          </div>
        ) : (
          approvedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200"
            >
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="w-16 h-16 rounded-full bg-grain-green text-white flex items-center justify-center text-xl font-bold">
                  {getInitials(user.firstName, user.lastName)}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      Approved
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.email} • {user.phone || 'No phone'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="capitalize">{user.role}</span> • Joined: {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
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
                Reject User Registration
              </h3>

              <p className="text-gray-600 mb-4">
                Are you sure you want to reject{' '}
                <span className="font-semibold">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </span>
                's registration?
              </p>

              {/* Rejection reason */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedUser(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading === `reject_${selectedUser?._id}`}
                  className="flex-1 px-4 py-2 bg-grain-yellow text-gray-800 rounded-lg hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {actionLoading === `reject_${selectedUser?._id}`
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

export default UserManagement;
