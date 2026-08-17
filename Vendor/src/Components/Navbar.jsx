import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { VendorContext } from "../Context/VendorContext";

const tabs = [
  { path: "/overview", label: "Overview" },
  { path: "/vehicles", label: "Vehicles" },
  { path: "/bookings", label: "Bookings" },
  { path: "/earnings", label: "Earnings" },
  { path: "/profile", label: "Profile" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { vToken, logoutVendor, dashboardStats } = useContext(VendorContext);

  const renderBadge = (label) =>
    label === "Bookings" && dashboardStats?.pendingBookings > 0 ? (
      <span className="min-w-[16px] h-[16px] px-1 bg-[#D6B36A] text-[#0B0D0F] text-[9px] font-bold flex items-center justify-center">
        {dashboardStats.pendingBookings}
      </span>
    ) : null;

  const scrollbarHide = "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

  return (
    <header className="sticky top-0 z-50 bg-[#0B0D0F] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px] gap-6">
          <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0">
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
            <nav className={`hidden md:flex items-center gap-1 overflow-x-auto ${scrollbarHide}`}>
              {tabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) =>
                    `relative px-4 h-16 md:h-[72px] flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] whitespace-nowrap transition-colors ${
                      isActive ? "text-[#F5F3EE]" : "text-[#70767C] hover:text-[#B5B8BB]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {tab.label}
                      {renderBadge(tab.label)}
                      {isActive && <span className="absolute left-4 right-4 -bottom-px h-[2px] bg-[#D6B36A]" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          )}

          {vToken && (
            <button
              onClick={() => {
                logoutVendor();
                navigate("/");
              }}
              className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B5B8BB] hover:text-[#D6B36A] transition-colors shrink-0"
            >
              Logout
            </button>
          )}
        </div>

        {vToken && (
          <nav className={`flex md:hidden items-center gap-1 overflow-x-auto pb-2 ${scrollbarHide}`}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive ? "text-[#F5F3EE]" : "text-[#70767C]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {tab.label}
                    {renderBadge(tab.label)}
                    {isActive && <span className="absolute left-2 right-2 -bottom-px h-[2px] bg-[#D6B36A]" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;