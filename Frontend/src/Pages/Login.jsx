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
  const [mode, setMode] = useState("login");
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
    <div className="min-h-screen w-full flex bg-[#F8F7F2]">

      {/* Left panel — image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#142033]">
        <img
          src={HERO_IMAGE_URL}
          alt="SpinCity"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142033] via-[#142033]/20 to-transparent" />

        <div className="absolute bottom-12 left-12 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#145A4A]" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#EDF5F1]">
              SpinCity · Kathmandu
            </p>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-[1.05]">
            Find your <br />
            <span className="text-[#4BA88F]">perfect ride.</span>
          </h2>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-8 sm:px-16 py-12">

        <div className="flex items-center justify-between mb-16">
          <Link to="/" className="font-serif text-xl font-semibold text-[#142033]">
            Spin<span className="text-[#145A4A]">City</span>
          </Link>
          <Link
            to="/vehicles"
            className="text-xs uppercase tracking-[0.15em] text-[#64748B] hover:text-[#145A4A] transition-colors"
          >
            Back to Fleet
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">

          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#145A4A] font-semibold mb-3">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#142033]">
              {mode === "login" ? (
                <>Sign <span className="text-[#145A4A]">In</span></>
              ) : (
                <>Get <span className="text-[#145A4A]">Started</span></>
              )}
            </h1>
            <p className="text-[#64748B] text-sm mt-4">
              {mode === "login"
                ? "Sign in to book a bike or scooter."
                : "Join SpinCity to start renting vehicles near you."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#64748B] font-medium mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full h-[48px] bg-white border border-[#E5E2D9] rounded-[4px] px-4 text-sm text-[#142033] placeholder:text-[#64748B] focus:outline-none focus:border-[#145A4A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#64748B] font-medium mb-1.5">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="98XXXXXXXX"
                    required
                    className="w-full h-[48px] bg-white border border-[#E5E2D9] rounded-[4px] px-4 text-sm text-[#142033] placeholder:text-[#64748B] focus:outline-none focus:border-[#145A4A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#64748B] font-medium mb-1.5">
                    Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your address"
                    required
                    className="w-full h-[48px] bg-white border border-[#E5E2D9] rounded-[4px] px-4 text-sm text-[#142033] placeholder:text-[#64748B] focus:outline-none focus:border-[#145A4A]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-[0.14em] text-[#64748B] font-medium mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="your@email.com"
                required
                className="w-full h-[48px] bg-white border border-[#E5E2D9] rounded-[4px] px-4 text-sm text-[#142033] placeholder:text-[#64748B] focus:outline-none focus:border-[#145A4A]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.14em] text-[#64748B] font-medium mb-1.5">
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                required
                className="w-full h-[48px] bg-white border border-[#E5E2D9] rounded-[4px] px-4 text-sm text-[#142033] placeholder:text-[#64748B] focus:outline-none focus:border-[#145A4A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#145A4A] hover:bg-[#0D3F35] text-white h-[48px] rounded-[4px] text-[13px] uppercase tracking-[0.1em] font-semibold transition-all disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-[#64748B] mt-6 text-center">
            {mode === "register" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#145A4A] font-medium hover:text-[#0D3F35] transition-colors"
                >
                  Sign in here
                </button>
              </>
            ) : (
              <>
                New to SpinCity?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-[#145A4A] font-medium hover:text-[#0D3F35] transition-colors"
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </div>

        <div className="mt-16">
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#64748B]">
            © {new Date().getFullYear()} SpinCity. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;