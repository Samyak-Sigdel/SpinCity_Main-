import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const VendorContext = createContext();

// shared across AddVehicleForm and any filter UI
export const VEHICLE_CATEGORIES = ["Car", "Motorbike", "Cycle"];

const VendorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKENDURL;

  const [vToken, setVToken] = useState(
    localStorage.getItem("vToken") ? localStorage.getItem("vToken") : false
  );
  const [vendorProfile, setVendorProfile] = useState(null);

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

  const logoutVendor = () => {
    localStorage.removeItem("vToken");
    setVToken(false);
    setVendorProfile(null);
  };

  const value = {
    backendUrl,
    vToken,
    setVToken,
    vendorProfile,
    getVendorProfile,
    logoutVendor,
  };

  useEffect(() => {
    if (vToken) {
      getVendorProfile();
    }
  }, [vToken]);

  return (
    <VendorContext.Provider value={value}>{props.children}</VendorContext.Provider>
  );
};

export default VendorContextProvider;