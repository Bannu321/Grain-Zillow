import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/views/Home";
import LearnMore from "./pages/views/LearnMore";
import ProblemSection from "./pages/views/ProblemSection";
import AboutSection from "./pages/views/Abtus";
import GrainZillowLogin from "./pages/views/Login";
import Signup from "./pages/views/SignUp";
import ContactUs_beforeLogin from "./pages/views/ContactUs_beforeLogin";
import Terms from "./pages/views/Terms";
import PrivacyPolicy from "./pages/views/Policy";
import ForgotPasswordRequest from "./pages/views/ForgotPasswordReques";
import ForgotPasswordVerify from "./pages/views/ForgotPasswordVerify";
import ForgotPasswordReset from "./pages/views/ForgotPasswordReset";

import AdminDashboard from "./pages/admin/AdminDashboard";
import SiloList from "./pages/admin/SiloList_Admin"; 
import SiloManagement from "./pages/admin/SiloManagement_Admin";  
import GrainsInventory from "./pages/admin/GrainsInventory_Admin";
import ManagersManagement from "./pages/admin/ManagersManagement_Admin"; 
import EmployeesManagement from "./pages/admin/EmployeeManagement_Admin";
import AdminContactManagement from "./pages/admin/AdminContactManagement";
import AdminMessageCentre from "./pages/admin/AdminMessageCentre";
import AdminProfile from "./pages/admin/AdminProfile";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeManagement from "./pages/manager/ManagerEmpMgnt";
import ManagerTask from "./pages/manager/ManagerTask";
import ManagerMSgCenter from "./pages/manager/ManagerMSgCenter";  
import Manager_History from "./pages/manager/Manager_History";
import Manager_grainentry from "./pages/manager/Manager_grainentry";
import ManagerProfile from "./pages/manager/ManagerProfile";
import ManagerAboutUs from "./pages/manager/ManagerAboutus";
import Manager_FAQ from "./pages/manager/Manager_FAQ";
import ContactUs from "./pages/manager/ManagerContactus";


import EmployeeDashboard from "./pages/employee/EmployeeDasboard";
import MyTasksEmp from "./pages/employee/MyTasksEmp";
import EmployeeMessages from "./pages/employee/MessageSecEmp";
import WorkHistory from "./pages/employee/WorkHisEmp";
import MyProfileEmp from "./pages/employee/MyProfileEmp";
import ContactUsEmp from "./pages/employee/ContactUsEmp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/problem" element={<ProblemSection />} />
        <Route path="/login" element={<GrainZillowLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contactus" element={<ContactUs_beforeLogin />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
        <Route path="/forgot-password/verify" element={<ForgotPasswordVerify />} />
        <Route path="/forgot-password/reset" element={<ForgotPasswordReset />} />


        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/silo-list" element={<SiloList />} />
        <Route path="/silo-management" element={<SiloManagement />} />
        <Route path="/grains-inventory" element={<GrainsInventory />} />
        <Route path="/managers-management" element={<ManagersManagement />} />
        <Route path="/employee-management" element={<EmployeesManagement />} />
        <Route path="/contact-management" element={<AdminContactManagement />} />
        <Route path="/message-centre" element={<AdminMessageCentre />} />
        <Route path="/my-profile" element={<AdminProfile />} />

        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/employee-management-mgr" element={<EmployeeManagement />} />
        <Route path="/task-assignment" element={<ManagerTask />} />
        <Route path="/message-centre-mgr" element={<ManagerMSgCenter />} />
        <Route path="/manager-history" element={<Manager_History />} />
        <Route path="/manager-grain-entry" element={<Manager_grainentry />} />
        <Route path="/manager-profile" element={<ManagerProfile />} />
        <Route path="/manager-aboutus" element={<ManagerAboutUs />} />
        <Route path="/manager-faq" element={<Manager_FAQ />} />
        <Route path="/contactus-mgr" element={<ContactUs />} />

        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/my-tasks" element={<MyTasksEmp />} />
        <Route path="/employee-messages" element={<EmployeeMessages />} />
        <Route path="/work-history" element={<WorkHistory />} />
        <Route path="/my-profile-emp" element={<MyProfileEmp />} />
        <Route path="/contactus-emp" element={<ContactUsEmp />} />

      </Routes>
    </Router>
  );
}

export default App;
