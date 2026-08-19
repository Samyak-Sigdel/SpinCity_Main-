import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CustomerContext } from "../Context/CustomerContext";
import { Menu, X, User, LogOut, CalendarCheck, Store } from "lucide-react";

// Vendor app lives on a different Vite dev server / different domain in prod.
// Set this in Customer project's .env as VITE_VENDOR_URL
const VENDOR_URL = import.meta.env.VITE_VENDOR_URL || "http://localhost:5174";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useContext(CustomerContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Fleet", path: "/vehicles" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E1D8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 border border-[#C9A24D] rotate-45 flex items-center justify-center transition-transform duration-300 group-hover:rotate-[135deg]">
              <span className="-rotate-45 text-[#C9A24D] text-lg font-serif font-semibold">S</span>
            </div>
            <div className="flex items-baseline leading-none">
              <span className="font-serif text-xl font-semibold text-[#172033]">Spin</span>
              <span className="font-serif text-xl font-semibold text-[#C9A24D]">City</span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  className={`relative text-[13px] font-medium uppercase tracking-[0.08em] py-2 transition-colors ${
                    active ? "text-[#C9A24D]" : "text-[#344054] hover:text-[#172033]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-[1px] h-[2px] bg-[#C9A24D] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
            {token && (
              <Link
                to="/my-bookings"
                className={`flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  location.pathname === "/my-bookings" ? "text-[#C9A24D]" : "text-[#344054] hover:text-[#172033]"
                }`}
              >
                <CalendarCheck size={15} strokeWidth={1.75} />
                Bookings
              </Link>
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-[13px] uppercase tracking-[0.08em] text-[#344054] hover:text-[#172033] transition-colors"
                >
                  <User size={15} strokeWidth={1.75} />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="flex items-center gap-1.5 border border-[#E5E1D8] hover:border-[#C9A24D] text-[#172033] px-5 h-[44px] rounded-[4px] text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors"
                >
                  <LogOut size={15} strokeWidth={1.75} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[13px] uppercase tracking-[0.08em] text-[#344054] hover:text-[#172033] transition-colors"
                >
                  Login
                </Link>
              </>
            )}

            {/* Cross-app link to the separate Vendor project — must be a plain <a>, not <Link> */}
            <a
              href={VENDOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#C9A24D] hover:brightness-95 hover:shadow-[0_4px_16px_rgba(23,32,51,0.08)] text-[#172033] px-5 h-[44px] rounded-[4px] text-[13px] font-semibold uppercase tracking-[0.06em] transition-all"
            >
              <Store size={15} strokeWidth={1.75} />
              Become a Vendor
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#172033]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Menu size={24} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E1D8]">
          <div className="px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path + link.label}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-xs uppercase tracking-[0.1em] text-[#344054] hover:text-[#172033]"
              >
                {link.label}
              </Link>
            ))}
            {token && (
              <>
                <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#344054]">
                  <CalendarCheck size={14} strokeWidth={1.75} />
                  My Bookings
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#344054]">
                  <User size={14} strokeWidth={1.75} />
                  Profile
                </Link>
              </>
            )}
            <div className="pt-2">
              {token ? (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-[#E5E1D8] py-3 rounded-[4px] text-xs uppercase tracking-[0.1em] text-[#172033]"
                >
                  <LogOut size={14} strokeWidth={1.75} />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full border border-[#E5E1D8] py-3 rounded-[4px] text-center text-xs uppercase tracking-[0.1em] text-[#172033]"
                  >
                    Login
                  </Link>
                </div>
              )}
              <a
                href={VENDOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-[#C9A24D] py-3 rounded-[4px] text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#172033]"
              >
                <Store size={14} strokeWidth={1.75} />
                Become a Vendor
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;