// VendorAuth.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";

const VendorAuth = () => {
  const { backendUrl, setVToken } = useContext(VendorContext);
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    shopName: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/vendor/login" : "/api/vendor/register";
      const payload =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        localStorage.setItem("vToken", data.token);
        setVToken(data.token);
        toast.success(mode === "login" ? "Welcome back!" : "Vendor account created");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F7F2] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#145A4A] mb-3">
            Spin City Vendors
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#142033]">
            {mode === "login" ? (
              "Vendor Login"
            ) : (
              <>
                Become a <span className="italic text-[#145A4A]">Vendor</span>
              </>
            )}
          </h1>
          <p className="text-[#64748B] text-sm mt-3">
            {mode === "login"
              ? "Sign in to manage your vehicles and bookings."
              : "List your scooters, motorbikes, and bicycles for rent."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-[#E5E2D9] bg-white rounded-lg shadow-[0_4px_16px_rgba(20,32,51,0.08)] p-5 md:p-7 flex flex-col gap-4"
        >
          {mode === "register" && (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] placeholder:text-[#64748B] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
              />
              <input
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Shop / business name"
                required
                className="h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] placeholder:text-[#64748B] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] placeholder:text-[#64748B] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Business address"
                required
                className="h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] placeholder:text-[#64748B] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] placeholder:text-[#64748B] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="h-[54px] bg-[#F8F7F2] border border-[#E5E2D9] rounded text-[#142033] placeholder:text-[#64748B] px-4 text-sm focus:outline-none focus:border-[#145A4A] focus:bg-white transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-[44px] bg-[#145A4A] hover:bg-[#0D3F35] text-white text-[13px] font-semibold uppercase tracking-[0.15em] rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Vendor Account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748B] mt-6">
          {mode === "login" ? "New to SpinCity? " : "Already a vendor? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-[#145A4A] font-semibold hover:text-[#0D3F35] transition-colors"
          >
            {mode === "login" ? "Register as a vendor" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VendorAuth;