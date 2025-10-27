import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ManagerRoute } from "./components/ProtectedRoute";

// Pre-login pages
import GrainZillowLogin from "./Login";
import Signup from "./SignUp";
import ContactUs_beforeLogin from "./ContactUs_beforeLogin";
import Terms from "./Terms";
import PrivacyPolicy from "./Policy";
import ForgotPasswordRequest from "./ForgotPasswordReques";
import ForgotPasswordVerify from "./ForgotPasswordVerify";
import ForgotPasswordReset from "./ForgotPasswordReset";

// Manager dashboard and pages
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/manager/Dashboard";
import UserManagement from "./pages/manager/UserManagement";
import StorageManagement from "./pages/manager/StorageManagement";
import Notifications from "./pages/manager/Notifications";
import Settings from "./pages/manager/Settings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Pre-login routes */}
          <Route path="/" element={<GrainZillowLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contactus" element={<ContactUs_beforeLogin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
          <Route path="/forgot-password/verify" element={<ForgotPasswordVerify />} />
          <Route path="/forgot-password/reset" element={<ForgotPasswordReset />} />

          {/* Manager protected routes */}
          <Route
            path="/manager/*"
            element={
              <ManagerRoute>
                <DashboardLayout />
              </ManagerRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="storage" element={<StorageManagement />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
