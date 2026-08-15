import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomerContext } from "../Context/CustomerContext";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setToken } = useContext(CustomerContext);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/user/login" : "/api/user/register";
      const payload =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(mode === "login" ? "Welcome back!" : "Account created");
        navigate("/");
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
    <div className="min-h-screen w-full flex bg-[#0B0D0F]">

      {/* ── Left panel — editorial image ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#111519]">
        <img
          src={HERO_IMAGE_URL}
          alt="Spin City"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0F] via-[#0B0D0F]/30 to-[#0B0D0F]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D0F]/40 via-transparent to-transparent" />

        {/* Route line motif */}
        <svg
          className="absolute left-12 top-12 h-[420px] w-[40px] pointer-events-none opacity-70"
          viewBox="0 0 40 420"
          fill="none"
        >
          <path
            d="M20 0 V300 Q20 340 60 340"
            stroke="#D6B36A"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          <circle cx="20" cy="4" r="4" fill="#D6B36A" />
        </svg>

        {/* Brand mark on image */}
        <div className="absolute bottom-12 left-12 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#D6B36A]" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6B36A]">
              Spin City · Kathmandu
            </p>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#F5F3EE] leading-[0.98] tracking-tight">
            Find Your <br />
            <span className="text-[#D6B36A] italic font-normal">Perfect Ride.</span>
          </h2>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-8 sm:px-16 py-12 bg-[#0B0D0F]">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-16">
          <Link
            to="/"
            className="text-sm tracking-[0.2em] uppercase font-medium text-[#F5F3EE] hover:text-[#D6B36A] transition-colors"
          >
            Spin City
          </Link>
          <Link
            to="/vehicles"
            className="text-xs uppercase tracking-[0.15em] text-[#70767C] hover:text-[#D6B36A] transition-colors font-light"
          >
            Back to Fleet
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">

          {/* Heading */}
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D6B36A] font-medium mb-3">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F5F3EE] tracking-tight">
              {mode === "login" ? (
                <>Sign <span className="font-normal italic text-[#D6B36A]">In</span></>
              ) : (
                <>Get <span className="font-normal italic text-[#D6B36A]">Started</span></>
              )}
            </h1>
            <p className="text-[#858B91] text-sm mt-4 font-light">
              {mode === "login"
                ? "Sign in to book a bike or scooter."
                : "Join Spin City to start renting vehicles near you."}
            </p>
          </div>

          {/* Fields */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-0 border-t border-white/10">

            {mode === "register" && (
              <>
                <div className="flex flex-col gap-1 border-b border-white/10 py-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#858B91] font-medium">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your name"
                    required
                    className="text-sm font-light text-[#F5F3EE] placeholder-[#4A4F55] focus:outline-none bg-transparent py-1"
                  />
                </div>

                <div className="flex flex-col gap-1 border-b border-white/10 py-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#858B91] font-medium">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="98XXXXXXXX"
                    required
                    className="text-sm font-light text-[#F5F3EE] placeholder-[#4A4F55] focus:outline-none bg-transparent py-1"
                  />
                </div>

                <div className="flex flex-col gap-1 border-b border-white/10 py-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#858B91] font-medium">
                    Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your address"
                    required
                    className="text-sm font-light text-[#F5F3EE] placeholder-[#4A4F55] focus:outline-none bg-transparent py-1"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1 border-b border-white/10 py-4">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#858B91] font-medium">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="your@email.com"
                required
                className="text-sm font-light text-[#F5F3EE] placeholder-[#4A4F55] focus:outline-none bg-transparent py-1"
              />
            </div>

            <div className="flex flex-col gap-1 border-b border-white/10 py-4">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#858B91] font-medium">
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                required
                className="text-sm font-light text-[#F5F3EE] placeholder-[#4A4F55] focus:outline-none bg-transparent py-1"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-[#D6B36A] text-[#0B0D0F] h-14 text-xs uppercase tracking-[0.2em] font-semibold border border-[#D6B36A] hover:bg-[#E5C783] transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-xs font-light text-[#858B91] mt-6 text-center">
            {mode === "register" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#D6B36A] underline underline-offset-2 cursor-pointer hover:text-[#E5C783] transition-colors"
                >
                  Sign in here
                </button>
              </>
            ) : (
              <>
                New to Spin City?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-[#D6B36A] underline underline-offset-2 cursor-pointer hover:text-[#E5C783] transition-colors"
                >
                  Create an account
                </button>
              </>
            )}
          </p>

        </div>

        {/* Bottom */}
        <div className="mt-16">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#4A4F55] font-light">
            © {new Date().getFullYear()} Spin City. All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;