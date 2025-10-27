import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import storageService from '../../services/storageService';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [personalInfoDirty, setPersonalInfoDirty] = useState(false);
  const [savingPersonalInfo, setSavingPersonalInfo] = useState(false);

  // Godown Info State
  const [godownInfo, setGodownInfo] = useState(null);

  // Load user data
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }

    // Fetch godown info
    const fetchGodownInfo = async () => {
      const result = await storageService.getManagerGodown();
      if (result.success) {
        setGodownInfo(result.data);
      }
    };

    fetchGodownInfo();
  }, [user]);

  // Handle profile picture file selection
  const handleProfilePictureSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('Only JPG/PNG files are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setProfilePicture(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;

    setUploadingPicture(true);
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    const result = await userService.uploadProfilePicture(formData);

    if (result.success) {
      toast.success('Profile picture updated successfully');
      updateUser({ profilePicture: result.data.profilePictureUrl });
      setProfilePicture(null);
      setProfilePicturePreview(null);
    } else {
      toast.error(result.message || 'Failed to upload profile picture');
    }

    setUploadingPicture(false);
  };

  // Get password strength
  const getPasswordStrength = (password) => {
    if (password.length < 8) return { strength: 'weak', color: 'bg-red-500', width: '33%' };
    if (password.length < 12 || !/\d/.test(password)) {
      return { strength: 'medium', color: 'bg-yellow-500', width: '66%' };
    }
    if (password.length >= 12 && /\d/.test(password) && /[A-Z]/.test(password)) {
      return { strength: 'strong', color: 'bg-green-500', width: '100%' };
    }
    return { strength: 'medium', color: 'bg-yellow-500', width: '66%' };
  };

  // Validate password
  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/\d/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!validatePassword()) return;

    setChangingPassword(true);
    const result = await userService.changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (result.success) {
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
    } else {
      toast.error(result.message || 'Failed to change password');
      if (result.message?.includes('incorrect')) {
        setPasswordErrors({ currentPassword: 'Current password is incorrect' });
      }
    }

    setChangingPassword(false);
  };

  // Handle personal info change
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
    setPersonalInfoDirty(true);
  };

  // Handle personal info save
  const handlePersonalInfoSave = async () => {
    // Validate
    if (!personalInfo.firstName.trim() || !personalInfo.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    setSavingPersonalInfo(true);
    const result = await userService.updateProfile({
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      phone: personalInfo.phone
    });

    if (result.success) {
      toast.success('Profile updated successfully');
      updateUser({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone
      });
      setPersonalInfoDirty(false);
    } else {
      toast.error(result.message || 'Failed to update profile');
    }

    setSavingPersonalInfo(false);
  };

  // Get user initials
  const getInitials = () => {
    if (!user) return '?';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveSection('profile')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeSection === 'profile'
              ? 'bg-grain-green text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Profile & Picture
        </button>
        <button
          onClick={() => setActiveSection('password')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeSection === 'password'
              ? 'bg-grain-green text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Change Password
        </button>
        <button
          onClick={() => setActiveSection('godown')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeSection === 'godown'
              ? 'bg-grain-green text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Godown Info
        </button>
      </div>

      {/* Profile & Picture Section */}
      {activeSection === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Picture</h3>

            {/* Current Picture */}
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full bg-grain-green text-white flex items-center justify-center text-4xl font-bold">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-grain-green transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleProfilePictureSelect}
                className="hidden"
                id="profile-picture-input"
              />
              <label htmlFor="profile-picture-input" className="cursor-pointer">
                <span className="text-4xl block mb-2">📷</span>
                <p className="text-sm text-gray-600">
                  Drag & drop image here or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
              </label>
            </div>

            {/* Preview */}
            {profilePicturePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="flex justify-center mb-4">
                  <img
                    src={profilePicturePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setProfilePicture(null);
                      setProfilePicturePreview(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfilePictureUpload}
                    disabled={uploadingPicture}
                    className="flex-1 px-4 py-2 bg-grain-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {uploadingPicture ? 'Uploading...' : 'Save Picture'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (cannot be changed)
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
                />
              </div>

              {/* Save Button */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => {
                    setPersonalInfo({
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      email: user?.email || '',
                      phone: user?.phone || ''
                    });
                    setPersonalInfoDirty(false);
                  }}
                  disabled={!personalInfoDirty}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePersonalInfoSave}
                  disabled={!personalInfoDirty || savingPersonalInfo}
                  className="flex-1 px-4 py-2 bg-grain-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {savingPersonalInfo ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Section */}
      {activeSection === 'password' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 max-w-2xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Change Password</h3>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
              />
              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-600 mt-1">{passwordErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-600 mt-1">{passwordErrors.newPassword}</p>
              )}

              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-semibold capitalize ${
                      passwordStrength.strength === 'weak' ? 'text-red-600' :
                      passwordStrength.strength === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grain-green focus:border-transparent"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            {/* Change Password Button */}
            <button
              onClick={handlePasswordChange}
              disabled={
                changingPassword ||
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
              className="w-full px-4 py-3 bg-grain-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {changingPassword ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </div>
      )}

      {/* Godown Info Section */}
      {activeSection === 'godown' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 max-w-2xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Godown Information</h3>

          {godownInfo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-lg font-semibold text-gray-800">{godownInfo.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Capacity</p>
                  <p className="text-lg font-semibold text-gray-800">{godownInfo.totalCapacity} m³</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Capacity</p>
                  <p className="text-lg font-semibold text-grain-green">{godownInfo.availableCapacity} m³</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zillow Device ID</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {godownInfo.zillowDevice?.deviceId || 'Not assigned'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading godown information...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
