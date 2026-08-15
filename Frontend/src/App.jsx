import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Vehicles from "./Pages/Vehicles";
import VehicleDetails from "./Pages/VehicleDetails";
import Checkout from "./Pages/Checkout";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import MyBookings from "./Pages/MyBookings";

const App = () => {
  return (
    <div className="bg-[#F7F5F0] min-h-screen flex flex-col">
      <ToastContainer position="top-right" />
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:productId" element={<VehicleDetails />} />
          <Route path="/checkout/:productId" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;