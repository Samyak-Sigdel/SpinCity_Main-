import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../Context/AdminContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { aToken, setAToken } = useContext(AdminContext);

  const logout = () => {
    localStorage.removeItem("aToken");
    setAToken("");
    navigate("/");
  };

  if (!aToken) return null;

  return (
    <header className="h-16 bg-white border-b border-[#E7E4DB] flex items-center justify-between px-6">
      <span className="text-sm text-[#5B6472]">Welcome, Admin</span>
      <button
        onClick={logout}
        className="text-sm font-semibold text-[#14171F] px-4 py-2 rounded-sm border border-[#E7E4DB] hover:bg-[#F7F5F0] transition-colors"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;