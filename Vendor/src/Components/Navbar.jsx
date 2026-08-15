import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VendorContext } from "../Context/VendorContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { vToken, logoutVendor } = useContext(VendorContext);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0D0F]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none" className="shrink-0 md:w-[26px] md:h-[26px]">
              <circle cx="13" cy="13" r="11" stroke="#D6B36A" strokeWidth="1.5" />
              <circle cx="13" cy="13" r="2.5" fill="#D6B36A" />
              <path d="M13 2v5M13 19v5M2 13h5M19 13h5" stroke="#D6B36A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-serif tracking-tight text-lg md:text-xl text-[#F5F3EE] truncate">
              Spin<span className="text-[#D6B36A] italic">City</span>
            </span>
            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.25em] text-[#60666C] ml-1 shrink-0">
              Vendor
            </span>
          </Link>

          {vToken && (
            <button
              onClick={() => {
                logoutVendor();
                navigate("/");
              }}
              className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B5B8BB] hover:text-[#D6B36A] transition-colors shrink-0 ml-3"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Signature dashed route line */}
      <div
        className="h-[2px] w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #D6B36A 0 18px, transparent 18px 30px)",
        }}
      />
    </header>
  );
};

export default Navbar;