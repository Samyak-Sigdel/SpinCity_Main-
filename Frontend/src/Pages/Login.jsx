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
    <div className="min-h-screen w-full flex bg-[#F7F5EF]">

      {/* Left panel — image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#172033]">
        <img
          src={HERO_IMAGE_URL}
          alt="SpinCity"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172033] via-[#172033]/20 to-transparent" />

        <div className="absolute bottom-12 left-12 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#C9A24D]" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24D]">
              SpinCity · Kathmandu
            </p>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-[1.05]">
            Find your <br />
            <span className="text-[#C9A24D]">perfect ride.</span>
          </h2>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-8 sm:px-16 py-12">

        <div className="flex items-center justify-between mb-16">
          <Link to="/" className="font-serif text-xl font-semibold text-[#172033]">
            Spin<span className="text-[#C9A24D]">City</span>
          </Link>
          <Link
            to="/vehicles"
            className="text-xs uppercase tracking-[0.15em] text-[#667085] hover:text-[#C9A24D] transition-colors"
          >
            Back to Fleet
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">

          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A24D] font-semibold mb-3">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#172033]">
              {mode === "login" ? (
                <>Sign <span className="text-[#C9A24D]">In</span></>
              ) : (
                <>Get <span className="text-[#C9A24D]">Started</span></>
              )}
            </h1>
            <p className="text-[#667085] text-sm mt-4">
              {mode === "login"
                ? "Sign in to book a bike or scooter."
                : "Join SpinCity to start renting vehicles near you."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#667085] font-medium mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full h-[48px] bg-white border border-[#E5E1D8] rounded-[4px] px-4 text-sm text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#C9A24D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#667085] font-medium mb-1.5">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="98XXXXXXXX"
                    required
                    className="w-full h-[48px] bg-white border border-[#E5E1D8] rounded-[4px] px-4 text-sm text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#C9A24D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#667085] font-medium mb-1.5">
                    Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your address"
                    required
                    className="w-full h-[48px] bg-white border border-[#E5E1D8] rounded-[4px] px-4 text-sm text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#C9A24D]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-[0.14em] text-[#667085] font-medium mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="your@email.com"
                required
                className="w-full h-[48px] bg-white border border-[#E5E1D8] rounded-[4px] px-4 text-sm text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#C9A24D]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.14em] text-[#667085] font-medium mb-1.5">
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                required
                className="w-full h-[48px] bg-white border border-[#E5E1D8] rounded-[4px] px-4 text-sm text-[#172033] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#C9A24D]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#C9A24D] text-[#172033] h-[48px] rounded-[4px] text-[13px] uppercase tracking-[0.1em] font-semibold hover:brightness-95 transition-all disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-[#667085] mt-6 text-center">
            {mode === "register" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#C9A24D] font-medium hover:text-[#9A7628] transition-colors"
                >
                  Sign in here
                </button>
              </>
            ) : (
              <>
                New to SpinCity?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-[#C9A24D] font-medium hover:text-[#9A7628] transition-colors"
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </div>

        <div className="mt-16">
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#98A2B3]">
            © {new Date().getFullYear()} SpinCity. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;