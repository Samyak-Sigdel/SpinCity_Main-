import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomerContext } from "../Context/CustomerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout } = useContext(CustomerContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Fleet", path: "/vehicles" },
    { label: "How It Works", path: "/vehicles" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0D0F]/95 backdrop-blur-xl border-b border-white/5">

      <div className="max-w-7xl mx-auto px-5 md:px-8">

        <div className="flex items-center justify-between h-[76px]">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >

            {/* Logo mark */}
            <div
              className="
                w-9 h-9
                border border-[#D6B36A]
                rotate-45
                flex items-center justify-center
                transition-transform duration-300
                group-hover:rotate-[135deg]
              "
            >
              <span className="-rotate-45 text-[#D6B36A] text-lg font-serif">
                S
              </span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl tracking-[0.18em] text-[#F5F3EE]">
                SPIN
              </span>

              <span className="text-[8px] tracking-[0.42em] text-[#D6B36A] mt-1">
                CITY
              </span>
            </div>

          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-9">

            {navLinks.map((link) => (
              <Link
                key={link.path + link.label}
                to={link.path}
                className="
                  relative
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#92989F]
                  hover:text-[#F5F3EE]
                  transition-colors
                  py-2
                  group
                "
              >
                {link.label}

                <span
                  className="
                    absolute
                    left-0
                    bottom-0
                    w-0
                    h-px
                    bg-[#D6B36A]
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </Link>
            ))}

            {token && (
              <Link
                to="/my-bookings"
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#92989F]
                  hover:text-[#F5F3EE]
                  transition-colors
                "
              >
                My Bookings
              </Link>
            )}

          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-5">

            {token ? (
              <>
                <Link
                  to="/profile"
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.18em]
                    text-[#92989F]
                    hover:text-[#F5F3EE]
                    transition-colors
                  "
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="
                    border border-white/15
                    hover:border-[#D6B36A]
                    text-[#F5F3EE]
                    hover:text-[#D6B36A]
                    px-5 py-2.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    transition-colors
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.18em]
                    text-[#92989F]
                    hover:text-[#F5F3EE]
                    transition-colors
                  "
                >
                  Login
                </Link>

                <Link
                  to="/vehicles"
                  className="
                    bg-[#D6B36A]
                    hover:bg-[#E5C783]
                    text-[#0B0D0F]
                    px-5 py-3
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    transition-colors
                  "
                >
                  Rent Now
                </Link>
              </>
            )}

          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#F5F3EE]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              {menuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0F1215] border-t border-white/5">

          <div className="px-5 py-6 flex flex-col gap-5">

            {navLinks.map((link) => (
              <Link
                key={link.path + link.label}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="
                  text-xs
                  uppercase
                  tracking-[0.18em]
                  text-[#92989F]
                  hover:text-[#F5F3EE]
                "
              >
                {link.label}
              </Link>
            ))}

            {token && (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setMenuOpen(false)}
                  className="
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    text-[#92989F]
                  "
                >
                  My Bookings
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    text-[#92989F]
                  "
                >
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
                  className="
                    w-full
                    border border-white/15
                    py-3
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    text-[#F5F3EE]
                  "
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">

                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="
                      w-full
                      border border-white/15
                      py-3
                      text-center
                      text-xs
                      uppercase
                      tracking-[0.18em]
                      text-[#F5F3EE]
                    "
                  >
                    Login
                  </Link>

                  <Link
                    to="/vehicles"
                    onClick={() => setMenuOpen(false)}
                    className="
                      w-full
                      bg-[#D6B36A]
                      py-3
                      text-center
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#0B0D0F]
                    "
                  >
                    Rent Now
                  </Link>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;