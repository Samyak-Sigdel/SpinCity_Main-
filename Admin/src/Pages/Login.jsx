import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../Context/AdminContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setAToken } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("aToken", data.token);
        setAToken(data.token);
        toast.success("Welcome back, Admin");
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D0F] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="font-serif tracking-wide text-3xl text-white">
            Spin <em className="italic text-[#D6B36A]">City</em>
          </span>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-3">
            Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-[#181D21] border border-white/10 p-8 flex flex-col gap-4"
        >
          <span className="pointer-events-none absolute -top-2.5 -left-2.5 w-5 h-5 border-t border-l border-[#D6B36A]/50" />
          <span className="pointer-events-none absolute -bottom-2.5 -right-2.5 w-5 h-5 border-b border-r border-[#D6B36A]/50" />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            required
            className="bg-transparent border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6B36A] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="bg-transparent border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6B36A] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#D6B36A] text-[#0B0D0F] py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#E8C784] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;