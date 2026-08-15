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
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-[Oswald] tracking-wide text-2xl text-[#14171F] uppercase">
            Spin<span className="text-[#FFB020]">City</span>
          </span>
          <p className="text-xs uppercase tracking-wide text-[#5B6472] mt-2">
            Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E7E4DB] rounded-sm p-8 flex flex-col gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            required
            className="border border-[#D8D5CC] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#FFB020]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="border border-[#D8D5CC] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#FFB020]"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#14171F] text-[#F7F5F0] py-3 rounded-sm text-sm font-semibold tracking-wide hover:bg-[#252A36] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;