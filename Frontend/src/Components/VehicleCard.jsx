import React from "react";
import { Link } from "react-router-dom";

const shortenAddress = (address) => {
  if (!address) return "";
  return address.split(",").slice(0, 2).join(", ").trim();
};

const formatDistance = (meters) => {
  if (meters == null) return null;
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)} m away` : `${km.toFixed(1)} km away`;
};

const VehicleCard = ({ vehicle }) => {
  const distanceLabel = formatDistance(vehicle.distanceMeters);

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="group flex flex-col md:flex-row items-stretch gap-4 bg-[#181D21] border border-white/10 p-5 transition-colors hover:border-[#D6B36A]/50"
    >
      {/* Left: details */}
      <div className="flex-1 min-w-0 order-2 md:order-1">
        <h3 className="font-serif text-lg text-[#F5F3EE]">{vehicle.name}</h3>
        <p className="text-sm text-[#858B91] mt-0.5">{vehicle.category}</p>

        {vehicle.owner?.shopName && (
          <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D6B36A]">
            {vehicle.owner.shopName}
          </span>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-[#8D9399]">
          <span>{vehicle.quantityAvailable} available</span>
          <span className="text-[#858B91]">·</span>
          <span>Free cancellation</span>
          <span className="text-[#858B91]">·</span>
          <span>Helmet included</span>
        </div>

        {vehicle.location?.address && (
          <div className="flex items-start gap-1.5 mt-3 text-xs text-[#858B91]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5 shrink-0">
              <path
                d="M6 0.75C3.79 0.75 2 2.54 2 4.75c0 3 4 6.5 4 6.5s4-3.5 4-6.5c0-2.21-1.79-4-4-4z"
                stroke="#858B91"
                strokeWidth="1"
              />
              <circle cx="6" cy="4.75" r="1.3" stroke="#858B91" strokeWidth="1" />
            </svg>
            <div>
              <p>{shortenAddress(vehicle.location.address)}</p>
              {distanceLabel && (
                <p className="text-[#D6B36A] font-medium mt-0.5">{distanceLabel}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Middle: image */}
      <div className="w-full md:w-40 h-32 shrink-0 order-1 md:order-2 overflow-hidden bg-[#181D21] rounded-sm relative flex items-center justify-center p-2">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Right: price + view button */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-36 shrink-0 order-3 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-5 text-right">
        <div>
          <p className="text-xl font-semibold text-[#F5F3EE] leading-tight">
            Rs. {vehicle.pricePerDay}
            <span className="text-sm font-normal text-[#858B91]">/day</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D6B36A] text-[#0B0D0F] text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors group-hover:bg-[#E5C783]">
          View
        </span>
      </div>
    </Link>
  );
};

export default VehicleCard;