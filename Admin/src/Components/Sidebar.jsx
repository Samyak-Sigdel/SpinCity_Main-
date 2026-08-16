import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../Context/AdminContext";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Vendors", path: "/admin/vendors" },
  { label: "Customers", path: "/admin/customers" },
  { label: "Vehicles", path: "/admin/vehicles" },
  { label: "Pending Approvals", path: "/admin/pending-approvals" },
  { label: "Bookings", path: "/admin/bookings" },
];

const Sidebar = ({ mobileNavOpen, setMobileNavOpen }) => {
  const { aToken } = useContext(AdminContext);

  if (!aToken) return null;

  const NavContent = ({ onNavigate }) => (
    <>
      <div className="px-2 mb-10">
        <span className="font-serif tracking-wide text-xl text-white">
          Spin<em className="italic text-[#D6B36A] not-italic font-serif italic">City</em>
        </span>
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mt-2">
          Admin Panel
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative px-3 py-2.5 text-sm tracking-wide transition-colors ${
                isActive
                  ? "text-[#D6B36A] bg-white/[0.04]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.03]"
              }`
            }
          >
            {({ isActive }) => (
              <span className="flex items-center gap-2">
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#D6B36A]" />
                )}
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-60 shrink-0 bg-[#0B0D0F] border-r border-white/10 min-h-screen py-8 px-4 hidden md:block">
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          {/* Drawer panel */}
          <aside className="relative w-72 max-w-[80%] bg-[#0B0D0F] border-r border-white/10 py-8 px-4 h-full overflow-y-auto">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-6 right-4 text-white/50 hover:text-white p-1"
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
            <NavContent onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;