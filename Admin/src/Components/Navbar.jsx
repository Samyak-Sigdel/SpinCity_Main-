import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../Context/AdminContext";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { aToken, setAToken } = useContext(AdminContext);

  const logout = () => {
    localStorage.removeItem("aToken");
    setAToken("");
    navigate("/");
  };

  if (!aToken) return null;

  return (
    <header className="h-16 bg-[#0B0D0F]/95 backdrop-blur border-b border-white/10 flex items-center justify-between px-5 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="md:hidden -ml-1 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-xs md:text-sm text-white/50">
          Welcome, <span className="text-white/80">Admin</span>
        </span>
      </div>
      <button
        onClick={logout}
        className="text-xs md:text-sm font-medium uppercase tracking-wide text-white/80 px-3 md:px-4 py-2 border border-white/15 hover:border-[#D6B36A]/50 hover:text-[#D6B36A] transition-colors"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;