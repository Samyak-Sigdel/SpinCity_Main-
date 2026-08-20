import React from "react";
import { Link } from "react-router-dom";

const shortenAddress = (address) => {
  if (!address) return "";
  return address.split(",")[0]?.trim();
};

const formatDistance = (meters) => {
  if (meters == null) return null;

  const km = meters / 1000;

  return km < 1
    ? `${Math.round(meters)} m away`
    : `${km.toFixed(1)} km away`;
};

const VehicleCard = ({ vehicle }) => {
  const distanceLabel = formatDistance(vehicle.distanceMeters);

  const isAvailable = (vehicle.quantityAvailable ?? 0) > 0;

  const isLowStock =
    isAvailable && vehicle.quantityAvailable <= 2;

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="
        group
        w-full
        flex
        items-center
        bg-white
        border
        border-[#E7E5DF]
        rounded-[10px]
        min-h-[145px]
        px-[18px]
        py-[14px]
        transition-all
        duration-200
        hover:shadow-[0_4px_16px_rgba(23,32,51,0.08)]
        hover:border-[#D8D5CC]
      "
    >

      {/* =========================================
          VEHICLE IMAGE
      ========================================= */}

      <div
        className="
          w-[145px]
          h-[115px]
          shrink-0
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
            duration-300
            group-hover:scale-[1.04]
          "
        />
      </div>

      {/* =========================================
          VEHICLE INFORMATION
      ========================================= */}

      <div
        className="
          ml-[22px]
          flex-1
          min-w-0
          h-full
          flex
          flex-col
          justify-center
        "
      >

        {/* Vehicle name */}

        <h3
          className="
            text-[20px]
            leading-[25px]
            font-semibold
            text-[#172033]
            truncate
          "
        >
          {vehicle.name}
        </h3>

        {/* Category */}

        <p
          className="
            text-[14px]
            leading-[19px]
            text-[#667085]
            mt-[2px]
          "
        >
          {vehicle.category}
        </p>

        {/* Availability */}

        <div
          className="
            flex
            items-center
            gap-[6px]
            mt-[7px]
            leading-none
          "
        >

          <span
            className={`
              w-[7px]
              h-[7px]
              rounded-full
              shrink-0
              ${
                isAvailable
                  ? "bg-[#178267]"
                  : "bg-[#C75C5C]"
              }
            `}
          />

          <span
            className={`
              text-[13px]
              font-semibold
              ${
                isAvailable
                  ? "text-[#178267]"
                  : "text-[#C75C5C]"
              }
            `}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>

          {isAvailable && (
            <span className="text-[13px] text-[#667085]">
              ·{" "}
              {isLowStock
                ? `only ${vehicle.quantityAvailable} left`
                : `${vehicle.quantityAvailable} available`}
            </span>
          )}

        </div>

        {/* Benefits */}

        <p
          className="
            text-[13px]
            leading-[18px]
            text-[#667085]
            mt-[6px]
          "
        >
          Free cancellation · Helmet included
        </p>

        {/* Location */}

        {vehicle.location?.address && (
          <div
            className="
              flex
              items-center
              gap-[6px]
              mt-[5px]
              text-[13px]
              leading-[18px]
              text-[#344054]
              min-w-0
            "
          >

            {/* Location icon */}

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                stroke="#178267"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="12"
                cy="10"
                r="2.5"
                stroke="#178267"
                strokeWidth="2"
              />
            </svg>

            <span className="truncate">
              {shortenAddress(vehicle.location.address)}
            </span>

            {distanceLabel && (
              <span className="text-[#667085] whitespace-nowrap">
                · {distanceLabel}
              </span>
            )}

          </div>
        )}

      </div>

      {/* =========================================
          PRICE + CTA
      ========================================= */}

      <div
        className="
          h-[110px]
          w-[165px]
          shrink-0
          ml-[22px]
          pl-[22px]
          border-l
          border-[#E7E5DF]
          flex
          flex-col
          items-end
          justify-center
        "
      >

        {/* Price */}

        <div
          className="
            flex
            items-baseline
            justify-end
            whitespace-nowrap
          "
        >

          <span
            className="
              text-[22px]
              leading-[27px]
              font-bold
              text-[#172033]
            "
          >
            Rs. {vehicle.pricePerDay}
          </span>

          <span
            className="
              text-[13px]
              text-[#667085]
              ml-[4px]
            "
          >
            /day
          </span>

        </div>

        {/* View details */}

        <span
          className="
            mt-[10px]
            h-[38px]
            min-w-[125px]
            px-[16px]
            rounded-[5px]
            bg-[#08785F]
            text-white
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.04em]
            flex
            items-center
            justify-center
            gap-[8px]
            transition-all
            duration-200
            group-hover:bg-[#06654F]
          "
        >
          View Details

          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6 4l4 4-4 4"
              stroke="white"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

        </span>

      </div>

    </Link>
  );
};

export default VehicleCard;