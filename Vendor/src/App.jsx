import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import VendorDashboard from "./Pages/VendorDashboard";

const App = () => {
  return (
    <div className="bg-[#F7F5F0] min-h-screen flex flex-col">
      <ToastContainer position="top-right" />
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<VendorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;