import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeData, setComposeData] = useState({
    recipientType: 'admin',
    recipientId: '',
    subject: '',
    message: ''
  });
  const [users, setUsers] = useState([]);
  const [sending, setSending] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    const result = await notificationService.getNotifications();
    if (result.success) {
      setNotifications(result.data || []);
      setLoading(false);
    } else {
      toast.error('Failed to load notifications');
      setLoading(false);
    }
  };

  // Fetch approved users for compose modal
  const fetchUsers = async () => {
    const result = await userService.getAllUsers({ isApproved: true });
    if (result.success) {
      setUsers(result.data || []);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUsers();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter notifications
  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'admin') return notifications.filter((n) => n.sender?.role === 'admin');
    if (filter === 'user') return notifications.filter((n) => n.sender?.role === 'user');
    if (filter === 'system') return notifications.filter((n) => !n.sender || n.category === 'system');
    if (filter === 'unread') return notifications.filter((n) => !n.isRead);
    return notifications;
  };

  // Get role-based styling
  const getRoleStyle = (notification) => {
    const senderRole = notification.sender?.role;

    if (senderRole === 'admin') {
      return {
        border: 'border-l-8 border-grain-orange shadow-orange-200',
        bg: 'bg-orange-50',
        icon: '👑',
        label: 'FROM ADMIN',
        labelColor: 'text-grain-orange'
      };
    } else if (senderRole === 'user') {
      return {
        border: 'border-l-8 border-grain-green shadow-green-200',
        bg: 'bg-green-50',
        icon: '👤',
        label: `FROM USER (${notification.sender?.firstName || 'Unknown'})`,
        labelColor: 'text-grain-green'
      };
    } else {
      return {
        border: 'border-l-8 border-grain-dark-green shadow-green-300',
        bg: 'bg-green-100',
        icon: '🌾',
        label: 'SYSTEM NOTIFICATION',
        labelColor: 'text-grain-dark-green'
      };
    }
  };

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    const result = await notificationService.markAsRead(notificationId);
    if (result.success) {
      setNotifications(
        notifications.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      toast.success('Marked as read');
    } else {
      toast.error('Failed to mark as read');
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    const result = await notificationService.markAllAsRead();
    if (result.success) {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } else {
      toast.error('Failed to mark all as read');
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    if (!window.confirm('Delete this notification?')) return;

    const result = await notificationService.deleteNotification(notificationId);
    if (result.success) {
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      toast.success('Notification deleted');
    } else {
      toast.error('Failed to delete notification');
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!composeData.message.trim() || composeData.message.length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    if (composeData.recipientType === 'user' && !composeData.recipientId) {
      toast.error('Please select a recipient');
      return;
    }

    setSending(true);
    const payload = {
      recipientRole: composeData.recipientType,
      message: composeData.message,
      subject: composeData.subject,
      category: 'other',
      priority: 'normal'
    };

    if (composeData.recipientType === 'user') {
      payload.recipientId = composeData.recipientId;
    }

    const result = await notificationService.sendMessage(payload);

    if (result.success) {
      toast.success('Message sent successfully');
      setShowComposeModal(false);
      setComposeData({
        recipientType: 'admin',
        recipientId: '',
        subject: '',
        message: ''
      });
    } else {
      toast.error(result.message || 'Failed to send message');
    }

    setSending(false);
  };

  // Get relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grain-green"></div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-grain-green text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'admin'
                ? 'bg-grain-green text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            From Admin
          </button>
          <button
            onClick={() => setFilter('user')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'user'
                ? 'bg-grain-green text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            From Users
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'system'
                ? 'bg-grain-green text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            System
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              filter === 'unread'
                ? 'bg-grain-green text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Mark All as Read
            </button>
          )}
          <button
            onClick={() => setShowComposeModal(true)}
            className="px-4 py-2 bg-grain-green text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Compose Message
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <span className="text-6xl mb-4 block">📬</span>
            <p className="text-gray-500 text-lg">No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const style = getRoleStyle(notification);
            return (
              <div
                key={notification._id}
                className={`rounded-xl p-5 shadow-md ${style.border} ${style.bg} ${
                  !notification.isRead ? 'opacity-100' : 'opacity-70'
                } transition-opacity`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <span className="text-3xl">{style.icon}</span>

                  {/* Content */}
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${style.labelColor} uppercase mb-1`}>
                      {style.label}
                    </p>
                    {notification.subject && (
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        {notification.subject}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {getRelativeTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-grain-green hover:bg-green-100 p-2 rounded transition-colors"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded transition-colors"
                      title="Delete"
                    >
                      ✗
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowComposeModal(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Send Message</h3>

              {/* Recipient Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To
                </label>
                <select
                  value={composeData.recipientType}
                  onChange={(e) =>
                    setComposeData({ ...composeData, recipientType: e.target.value, recipientId: '' })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* User Select (if recipient is user) */}
              {composeData.recipientType === 'user' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={composeData.recipientId}
                    onChange={(e) => setComposeData({ ...composeData, recipientId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
                  >
                    <option value="">-- Select User --</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="Enter subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message * (10-500 characters)
                </label>
                <textarea
                  value={composeData.message}
                  onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                  placeholder="Type your message..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {composeData.message.length} / 500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowComposeModal(false);
                    setComposeData({
                      recipientType: 'admin',
                      recipientId: '',
                      subject: '',
                      message: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={sending || composeData.message.length < 10}
                  className="flex-1 px-4 py-2 bg-grain-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
