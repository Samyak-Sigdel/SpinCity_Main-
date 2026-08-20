import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* =========================================================
   POPULAR VEHICLE CARD
========================================================= */

const PopularVehicleCard = ({ vehicle }) => {
  const available = (vehicle.quantityAvailable ?? 0) > 0;

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="
        group
        block
        bg-white
        border
        border-[#E5E2D9]
        rounded-[10px]
        overflow-hidden
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:shadow-[0_8px_24px_rgba(20,32,51,0.08)]
      "
    >
      {/* =====================================================
          VEHICLE IMAGE
          Pure white background — no extra elements
      ====================================================== */}

      <div
        className="
          w-full
          h-[245px]
          bg-white
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="
            w-full
            h-full
            object-contain
            transition-transform
            duration-500
            group-hover:scale-[1.025]
          "
        />
      </div>

      {/* =====================================================
          VEHICLE DETAILS
      ====================================================== */}

      <div
        className="
          bg-white
          px-[18px]
          pt-[17px]
          pb-[18px]
        "
      >
        {/* Vehicle name + price */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          {/* Name */}

          <div className="min-w-0">

            <h3
              className="
                font-['Inter']
                text-[16px]
                font-semibold
                leading-[1.35]
                text-[#142033]
                truncate
              "
            >
              {vehicle.name}
            </h3>

            <p
              className="
                mt-[6px]
                font-['Inter']
                text-[13px]
                leading-[1.3]
                text-[#64748B]
              "
            >
              {vehicle.category}
            </p>

          </div>

          {/* Price */}

          <div
            className="
              shrink-0
              text-right
              pt-[1px]
            "
          >

            <div className="flex items-baseline">

              <span
                className="
                  font-['Inter']
                  text-[16px]
                  font-semibold
                  text-[#145A4A]
                  whitespace-nowrap
                "
              >
                Rs. {vehicle.pricePerDay}
              </span>

              <span
                className="
                  ml-[2px]
                  font-['Inter']
                  text-[12px]
                  text-[#64748B]
                "
              >
                /day
              </span>

            </div>

          </div>
        </div>

        {/* Availability */}

        <div className="mt-[18px]">

          <span
            className={`
              inline-flex
              items-center
              h-[27px]
              px-[10px]
              rounded-[5px]
              font-['Inter']
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.04em]
              ${
                available
                  ? "bg-[#EDF5F1] text-[#145A4A]"
                  : "bg-[#FBEAEA] text-[#C75C5C]"
              }
            `}
          >
            {available ? "Available" : "Unavailable"}
          </span>

        </div>
      </div>
    </Link>
  );
};

/* =========================================================
   POPULAR VEHICLES SECTION
   Background exactly like reference:
   Off-white section + white vehicle cards
========================================================= */

const PopularVehicles = ({ vehicles }) => {
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section
      className="
        bg-[#F8F7F2]
        w-full
        py-[58px]
        md:py-[72px]
      "
    >

      <div
        className="
          max-w-[1280px]
          mx-auto
          px-5
          md:px-10
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            items-end
            justify-between
            mb-[30px]
          "
        >

          {/* LEFT */}

          <div>

            <p
              className="
                font-['Inter']
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.26em]
                text-[#145A4A]
                mb-[9px]
              "
            >
              Popular Vehicles
            </p>

            <h2
              className="
                font-['Oswald']
                text-[38px]
                md:text-[42px]
                font-semibold
                leading-[1.05]
                tracking-[-0.025em]
                text-[#142033]
              "
            >
              Top picks for you
            </h2>

          </div>


          {/* VIEW ALL */}

          <Link
            to="/vehicles"
            className="
              hidden
              sm:flex
              items-center
              gap-[7px]
              mb-[3px]
              font-['Inter']
              text-[13px]
              font-medium
              text-[#145A4A]
              hover:text-[#0D3F35]
              transition-colors
            "
          >

            View all vehicles

            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />

          </Link>

        </div>


        {/* =================================================
            VEHICLE GRID
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-[22px]
          "
        >

          {vehicles.map(
            (vehicle) => (
              <PopularVehicleCard
                key={vehicle._id}
                vehicle={vehicle}
              />
            )
          )}

        </div>


        {/* MOBILE VIEW ALL */}

        <Link
          to="/vehicles"
          className="
            sm:hidden
            mt-[22px]
            w-full
            h-[46px]
            flex
            items-center
            justify-center
            gap-[7px]
            bg-white
            border
            border-[#E5E2D9]
            rounded-[7px]
            font-['Inter']
            text-[13px]
            font-medium
            text-[#145A4A]
          "
        >

          View all vehicles

          <ArrowRight
            size={16}
            strokeWidth={1.8}
          />

        </Link>

      </div>

    </section>
  );
};

export default PopularVehicles;