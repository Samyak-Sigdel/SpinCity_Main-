import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const CustomerContext = createContext();

// shared across Vehicles filter, VehicleCard, etc.
export const VEHICLE_CATEGORIES = ["Car", "Motorbike", "Cycle"];

const CustomerContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKENDURL;

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [customerProfile, setCustomerProfile] = useState(null);

  const getCustomerProfile = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/profile", {
        headers: { ctoken: token },
      });
      if (data.success) {
        setCustomerProfile(data.customer);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    setCustomerProfile(null);
  };

  const value = {
    backendUrl,
    token,
    setToken,
    customerProfile,
    getCustomerProfile,
    logout,
  };

  useEffect(() => {
    if (token) {
      getCustomerProfile();
    }
  }, [token]);

  return (
    <CustomerContext.Provider value={value}>
      {props.children}
    </CustomerContext.Provider>
  );
};

export default CustomerContextProvider;