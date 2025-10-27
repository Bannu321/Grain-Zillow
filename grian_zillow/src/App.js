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
      </Routes>
    </Router>
  );
}

export default App;
