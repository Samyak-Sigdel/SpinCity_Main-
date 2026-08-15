import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminContext } from "./Context/AdminContext";
import Layout from "./Components/Layout";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Vendors from "./Pages/Vendors";
import Customers from "./Pages/Customers";
import Vehicles from "./Pages/Vehicles";
import PendingApprovals from "./Pages/PendingApprovals";
import Bookings from "./Pages/Bookings";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <ToastContainer position="top-right" />

      {!aToken ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/vendors" element={<Vendors />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/vehicles" element={<Vehicles />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovals />} />
            <Route path="/admin/bookings" element={<Bookings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Layout>
      )}
    </div>
  );
};

export default App;
