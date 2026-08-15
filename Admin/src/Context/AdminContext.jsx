import React, { useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKENDURL;

  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dashData, setDashData] = useState(null);

  const headers = { atoken: aToken };

  // ---------------- Vendors ----------------

  const getAllVendors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/vendors", { headers });
      if (data.success) {
        setVendors(data.vendors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendors.");
    }
  };

  const approveVendor = async (vendorId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/approve-vendor",
        { vendorId },
        { headers }
      );
      if (data.success) {
        toast.success(data.message);
        getAllVendors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve vendor.");
    }
  };

  const toggleVendorBlock = async (vendorId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/toggle-block-vendor",
        { vendorId },
        { headers }
      );
      if (data.success) {
        toast.success(data.message);
        getAllVendors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update vendor status.");
    }
  };

  // ---------------- Customers ----------------

  const getAllCustomers = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/customers", { headers });
      if (data.success) {
        setCustomers(data.customers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers.");
    }
  };

  // ---------------- Products / Vehicles ----------------

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/products", { headers });
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vehicles.");
    }
  };

  const getPendingProducts = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/pending-products", { headers });
      if (data.success) {
        setPendingProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pending vehicles.");
    }
  };

  const approveProduct = async (productId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/approve-product",
        { productId },
        { headers }
      );
      if (data.success) {
        toast.success(data.message);
        getPendingProducts();
        getAllProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve vehicle.");
    }
  };

  const removeProduct = async (productId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/remove-product",
        { productId },
        { headers }
      );
      if (data.success) {
        toast.success(data.message);
        getPendingProducts();
        getAllProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove vehicle.");
    }
  };

  // ---------------- Bookings ----------------

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/bookings", { headers });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings.");
    }
  };

  // ---------------- Dashboard ----------------

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", { headers });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data.");
    }
  };

  const value = {
    backendUrl,
    aToken,
    setAToken,
    vendors,
    getAllVendors,
    approveVendor,
    toggleVendorBlock,
    customers,
    getAllCustomers,
    products,
    getAllProducts,
    pendingProducts,
    getPendingProducts,
    approveProduct,
    removeProduct,
    bookings,
    getAllBookings,
    dashData,
    getDashboardData,
  };

  return (
    <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;