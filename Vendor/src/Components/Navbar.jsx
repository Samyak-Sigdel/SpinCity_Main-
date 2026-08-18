// Navbar.jsx
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
      <span className="min-w-[16px] h-[16px] px-1 bg-[#C9A24D] text-[#172033] text-[9px] font-bold flex items-center justify-center rounded-full">
        {dashboardStats.pendingBookings}
      </span>
    ) : null;

  const scrollbarHide = "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px] gap-6">
          <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0">
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none" className="shrink-0 md:w-[26px] md:h-[26px]">
              <circle cx="13" cy="13" r="11" stroke="#C9A24D" strokeWidth="1.5" />
              <circle cx="13" cy="13" r="2.5" fill="#C9A24D" />
              <path d="M13 2v5M13 19v5M2 13h5M19 13h5" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-serif tracking-tight text-lg md:text-xl text-[#172033] truncate">
              Spin<span className="text-[#C9A24D] italic">City</span>
            </span>
            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.25em] text-[#98A2B3] ml-1 shrink-0">
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
                      isActive ? "text-[#C9A24D]" : "text-[#667085] hover:text-[#344054]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {tab.label}
                      {renderBadge(tab.label)}
                      {isActive && <span className="absolute left-4 right-4 -bottom-px h-[2px] bg-[#C9A24D]" />}
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
              className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#344054] hover:text-[#C9A24D] transition-colors shrink-0"
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
                    isActive ? "text-[#C9A24D]" : "text-[#667085]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {tab.label}
                    {renderBadge(tab.label)}
                    {isActive && <span className="absolute left-2 right-2 -bottom-px h-[2px] bg-[#C9A24D]" />}
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