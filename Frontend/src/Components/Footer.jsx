import React from "react";
import { Link } from "react-router-dom";
import { VEHICLE_CATEGORIES } from "../Context/CustomerContext";

const Footer = () => {
  return (
    <footer className="bg-[#080A0C] text-[#92989F]">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand */}
          <div className="lg:col-span-2">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              <div
                className="
                  w-10 h-10
                  border border-[#D6B36A]
                  rotate-45
                  flex items-center justify-center
                "
              >
                <span className="-rotate-45 text-[#D6B36A] text-xl font-serif">
                  S
                </span>
              </div>

              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl tracking-[0.18em] text-[#F5F3EE]">
                  SPIN
                </span>

                <span className="text-[8px] tracking-[0.42em] text-[#D6B36A] mt-1">
                  CITY
                </span>
              </div>

            </Link>

            <p className="mt-7 max-w-md text-sm leading-7 text-[#73797F]">
              Premium bikes and scooters for every journey.
              Discover your next ride and experience the freedom
              of the open road.
            </p>

            <Link
              to="/vehicles"
              className="
                inline-flex
                items-center
                gap-3
                mt-7
                text-[10px]
                uppercase
                tracking-[0.22em]
                text-[#D6B36A]
                hover:text-[#E5C783]
                transition-colors
              "
            >
              Explore the fleet
              <span>→</span>
            </Link>

          </div>

          {/* Explore */}
          <div>

            <h4 className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#F5F3EE]
              mb-6
            ">
              Explore
            </h4>

            <ul className="space-y-4 text-sm">

              <li>
                <Link
                  to="/"
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/vehicles"
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Our Fleet
                </Link>
              </li>

              <li>
                <Link
                  to="/my-bookings"
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  My Bookings
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  My Profile
                </Link>
              </li>

            </ul>

          </div>

          {/* Vehicle Types */}
          <div>

            <h4 className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#F5F3EE]
              mb-6
            ">
              Vehicle Types
            </h4>

            <ul className="space-y-4 text-sm">

              {VEHICLE_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    to={`/vehicles?category=${category}`}
                    className="hover:text-[#D6B36A] transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}

            </ul>

          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-14" />

        {/* Bottom */}
        <div className="
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-5
        ">

          <p className="text-[10px] uppercase tracking-[0.15em] text-[#555B61]">
            © {new Date().getFullYear()} Spin City. All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#555B61]">
              Ride. Explore. Repeat.
            </span>

            <span className="w-8 h-px bg-[#D6B36A]" />

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;