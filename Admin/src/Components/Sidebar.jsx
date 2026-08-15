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

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);

  if (!aToken) return null;

  return (
    <aside className="w-60 shrink-0 bg-[#14171F] min-h-screen py-8 px-4 hidden md:block">
      <div className="px-2 mb-10">
        <span className="font-[Oswald] tracking-wide text-lg text-[#F7F5F0] uppercase">
          Spin<span className="text-[#FFB020]">City</span>
        </span>
        <p className="text-[11px] uppercase tracking-wide text-[#5B6472] mt-1">
          Admin Panel
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#1F2330] text-[#FFB020]"
                  : "text-[#C6CAD3] hover:bg-[#1F2330] hover:text-[#F7F5F0]"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;