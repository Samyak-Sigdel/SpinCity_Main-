import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CustomerContext } from "../Context/CustomerContext";
import {
  Menu,
  X,
  User,
  LogOut,
  CalendarCheck,
  Store,
} from "lucide-react";

// Vendor app lives on a different Vite dev server / different domain in prod.
const VENDOR_URL =
  import.meta.env.VITE_VENDOR_URL || "http://localhost:5174";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useContext(CustomerContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Vehicles", path: "/vehicles" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F8F7F2] px-4 md:px-6 lg:px-8 py-4">
      <div className="max-w-[1400px] mx-auto">
        <div
          className="
            bg-[#FFFFFF]
            border border-[#E5E2D9]
            rounded-2xl
            shadow-[0_8px_30px_rgba(20,32,51,0.05)]
          "
        >
          <div className="flex items-center justify-between h-[76px] px-5 md:px-8 lg:px-10">

            {/* ================= LOGO ================= */}
            <Link
              to="/"
              className="flex items-center gap-3 shrink-0 group"
            >
              {/* Logo mark */}
              <div
                className="
                  relative
                  w-10 h-10
                  border border-[#145A4A]
                  rotate-45
                  flex items-center justify-center
                  transition-transform duration-300
                  group-hover:rotate-[135deg]
                "
              >
                <span
                  className="
                    -rotate-45
                    text-[#145A4A]
                    text-xl
                    font-serif
                    font-semibold
                    transition-transform duration-300
                  "
                >
                  S
                </span>
              </div>

              {/* Logo text */}
              <div className="flex items-baseline leading-none">
                <span className="font-serif text-[23px] font-semibold text-[#142033]">
                  Spin
                </span>
                <span className="font-serif text-[23px] font-semibold text-[#145A4A]">
                  City
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <nav className="hidden md:flex items-center gap-10 lg:gap-12 ml-10">
              {navLinks.map((link) => {
                const active =
                  location.pathname === link.path;

                return (
                  <Link
                    key={link.path + link.label}
                    to={link.path}
                    className={`
                      relative
                      py-2
                      text-[13px]
                      font-medium
                      uppercase
                      tracking-[0.1em]
                      transition-colors
                      ${
                        active
                          ? "text-[#145A4A]"
                          : "text-[#64748B] hover:text-[#142033]"
                      }
                    `}
                  >
                    {link.label}

                    {/* Active indicator */}
                    <span
                      className={`
                        absolute
                        left-0
                        -bottom-[4px]
                        h-[2px]
                        bg-[#145A4A]
                        transition-all
                        duration-300
                        ${
                          active
                            ? "w-full"
                            : "w-0"
                        }
                      `}
                    />
                  </Link>
                );
              })}

              {/* Bookings only when logged in */}
              {token && (
                <Link
                  to="/my-bookings"
                  className={`
                    flex items-center gap-2
                    py-2
                    text-[13px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    transition-colors
                    ${
                      location.pathname === "/my-bookings"
                        ? "text-[#145A4A]"
                        : "text-[#64748B] hover:text-[#142033]"
                    }
                  `}
                >
                  <CalendarCheck
                    size={16}
                    strokeWidth={1.8}
                  />
                  Bookings
                </Link>
              )}
            </nav>

            {/* ================= DESKTOP ACTIONS ================= */}
            <div className="hidden md:flex items-center gap-5 ml-auto">

              {/* Logged-in state */}
              {token ? (
                <>
                  {/* Profile removed */}

                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="
                      flex items-center gap-2
                      h-[44px]
                      px-5
                      rounded-xl
                      border border-[#E5E2D9]
                      bg-[#FFFFFF]
                      text-[#142033]
                      text-[13px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      hover:border-[#145A4A]
                      hover:bg-[#EDF5F1]
                      transition-all
                    "
                  >
                    <LogOut size={16} strokeWidth={1.7} />
                    Logout
                  </button>
                </>
              ) : (
                /* Login */
                <Link
                  to="/login"
                  className="
                    flex items-center gap-2
                    text-[13px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-[#64748B]
                    hover:text-[#145A4A]
                    transition-colors
                  "
                >
                  <User size={17} strokeWidth={1.7} />
                  Login
                </Link>
              )}

              {/* ================= VENDOR CTA ================= */}
              <a
                href={VENDOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center gap-2.5
                  h-[46px]
                  px-6
                  rounded-xl
                  bg-[#145A4A]
                  text-white
                  text-[13px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  hover:bg-[#0D3F35]
                  hover:shadow-[0_8px_20px_rgba(20,90,74,0.18)]
                  transition-all
                "
              >
                <Store
                  size={16}
                  strokeWidth={1.8}
                />
                Become a Vendor
              </a>
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              className="
                md:hidden
                w-10 h-10
                rounded-xl
                flex items-center justify-center
                text-[#142033]
                hover:bg-[#EDF5F1]
                transition-colors
              "
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X size={22} strokeWidth={1.7} />
              ) : (
                <Menu size={22} strokeWidth={1.7} />
              )}
            </button>
          </div>

          {/* ================= MOBILE MENU ================= */}
          {menuOpen && (
            <div className="md:hidden border-t border-[#E5E2D9]">
              <div className="px-6 py-6 flex flex-col gap-2">

                {/* Navigation */}
                {navLinks.map((link) => {
                  const active =
                    location.pathname === link.path;

                  return (
                    <Link
                      key={link.path + link.label}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`
                        px-4 py-3
                        rounded-xl
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.1em]
                        transition-colors
                        ${
                          active
                            ? "bg-[#EDF5F1] text-[#145A4A]"
                            : "text-[#64748B] hover:bg-[#EDF5F1] hover:text-[#142033]"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Logged-in links */}
                {token && (
                  <>
                    <Link
                      to="/my-bookings"
                      onClick={() => setMenuOpen(false)}
                      className="
                        flex items-center gap-3
                        px-4 py-3
                        rounded-xl
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.1em]
                        text-[#64748B]
                        hover:bg-[#EDF5F1]
                        hover:text-[#145A4A]
                      "
                    >
                      <CalendarCheck
                        size={16}
                        strokeWidth={1.7}
                      />
                      My Bookings
                    </Link>

                    {/* Profile removed */}
                  </>
                )}

                {/* Mobile actions */}
                <div className="pt-4 mt-2 border-t border-[#E5E2D9]">

                  {token ? (
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                      className="
                        w-full
                        flex items-center justify-center gap-2
                        h-12
                        rounded-xl
                        border border-[#E5E2D9]
                        text-[#142033]
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        hover:bg-[#EDF5F1]
                        hover:border-[#145A4A]
                        transition-all
                      "
                    >
                      <LogOut
                        size={16}
                        strokeWidth={1.7}
                      />
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="
                        w-full
                        flex items-center justify-center gap-2
                        h-12
                        rounded-xl
                        border border-[#E5E2D9]
                        text-[#142033]
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        hover:bg-[#EDF5F1]
                        hover:border-[#145A4A]
                        transition-all
                      "
                    >
                      <User
                        size={16}
                        strokeWidth={1.7}
                      />
                      Login
                    </Link>
                  )}

                  {/* Mobile vendor button */}
                  <a
                    href={VENDOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="
                      mt-3
                      w-full
                      h-12
                      flex items-center justify-center gap-2
                      rounded-xl
                      bg-[#145A4A]
                      text-white
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.1em]
                      hover:bg-[#0D3F35]
                      transition-colors
                    "
                  >
                    <Store
                      size={16}
                      strokeWidth={1.8}
                    />
                    Become a Vendor
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;