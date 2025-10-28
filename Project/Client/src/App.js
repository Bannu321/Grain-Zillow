import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import LearnMore from "./LearnMore";
import ProblemSection from "./ProblemSection";
import AboutSection from "./Abtus";
import GrainZillowLogin from "./Login";
import Signup from "./SignUp";
import ContactUs_beforeLogin from "./ContactUs_beforeLogin";
import Terms from "./Terms";
import PrivacyPolicy from "./Policy";
import ForgotPasswordRequest from "./ForgotPasswordReques";
import ForgotPasswordVerify from "./ForgotPasswordVerify";
import ForgotPasswordReset from "./ForgotPasswordReset";
import AdminDashboard from "./AdminDashboard";
import SiloList from "./SiloList_Admin"; 
import SiloManagement from "./SiloManagement_Admin";  
import GrainsInventory from "./GrainsInventory_Admin";
import ManagersManagement from "./ManagersManagement_Admin"; 
import EmployeesManagement from "./EmployeeManagement_Admin";
import AdminContactManagement from "./AdminContactManagement";
import AdminMessageCentre from "./AdminMessageCentre";
import AdminProfile from "./AdminProfile";

import ManagerDashboard from "./ManagerDashboard";
import EmployeeManagement from "./ManagerEmpMgnt";
import ManagerTask from "./ManagerTask";
import ManagerMSgCenter from "./ManagerMSgCenter";  
import Manager_History from "./Manager_History";
import Manager_grainentry from "./Manager_grainentry";
import ManagerProfile from "./ManagerProfile";
import ManagerAboutUs from "./ManagerAboutus";
import Manager_FAQ from "./Manager_FAQ";
import ContactUs from "./ManagerContactus";


import EmployeeDashboard from "./EmployeeDasboard";
import MyTasksEmp from "./MyTasksEmp";
import EmployeeMessages from "./MessageSecEmp";
import WorkHistory from "./WorkHisEmp";
import MyProfileEmp from "./MyProfileEmp";
import ContactUsEmp from "./ContactUsEmp";
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
