import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const VendorContext = createContext();

export const VEHICLE_CATEGORIES = ["Scooter", "Motorbike", "Cycle"];

const VendorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKENDURL;

  const [vToken, setVToken] = useState(
    localStorage.getItem("vToken") ? localStorage.getItem("vToken") : false
  );
  const [vendorProfile, setVendorProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  const getVendorProfile = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/vendor/profile", {
        headers: { vtoken: vToken },
      });
      if (data.success) {
        setVendorProfile(data.vendor);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendor profile.");
    }
  };

  const getDashboardStats = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/vendor/dashboard", {
        headers: { vtoken: vToken },
      });
      if (data.success) {
        setDashboardStats(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard stats.");
    }
  };

  const logoutVendor = () => {
    localStorage.removeItem("vToken");
    setVToken(false);
    setVendorProfile(null);
    setDashboardStats(null);
  };

  const value = {
    backendUrl,
    vToken,
    setVToken,
    vendorProfile,
    getVendorProfile,
    dashboardStats,
    getDashboardStats,
    logoutVendor,
  };

  useEffect(() => {
    if (vToken) {
      getVendorProfile();
      getDashboardStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vToken]);

  return (
    <VendorContext.Provider value={value}>{props.children}</VendorContext.Provider>
  );
};

export default VendorContextProvider;