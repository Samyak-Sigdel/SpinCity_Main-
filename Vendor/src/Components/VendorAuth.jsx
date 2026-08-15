import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VendorContext } from "../Context/VendorContext";

const VendorAuth = () => {
  const { backendUrl, setVToken } = useContext(VendorContext);
  const [mode, setMode] = useState("login"); // "login" | "register"
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
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0D0F] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#D6B36A] mb-3">
            Spin City Vendors
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#F5F3EE]">
            {mode === "login" ? (
              "Vendor Login"
            ) : (
              <>
                Become a <span className="italic text-[#D6B36A]">Vendor</span>
              </>
            )}
          </h1>
          <p className="text-[#858B91] text-sm mt-3">
            {mode === "login"
              ? "Sign in to manage your vehicles and bookings."
              : "List your scooters, motorbikes, and bicycles for rent."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-white/10 bg-[#101417] p-5 md:p-7 flex flex-col gap-4"
        >
          {mode === "register" && (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
              />
              <input
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Shop / business name"
                required
                className="h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Business address"
                required
                className="h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
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
            className="h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="h-[54px] bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 text-sm focus:outline-none focus:border-[#D6B36A]"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-[54px] bg-[#D6B36A] hover:bg-[#E5C783] text-[#0B0D0F] text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Vendor Account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#858B91] mt-6">
          {mode === "login" ? "New to SpinCity? " : "Already a vendor? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-[#D6B36A] font-semibold hover:text-[#E5C783] transition-colors"
          >
            {mode === "login" ? "Register as a vendor" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VendorAuth;