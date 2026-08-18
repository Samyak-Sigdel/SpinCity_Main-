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
  const isAvailable = (vehicle.quantityAvailable ?? 0) > 0;

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="group flex flex-col md:flex-row items-stretch gap-4 bg-white border border-[#E5E1D8] rounded-[8px] p-4 shadow-[0_2px_8px_rgba(23,32,51,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(23,32,51,0.08)] hover:border-[#C9A24D]/50"
    >
      {/* Image */}
      <div className="w-full md:w-40 h-32 shrink-0 order-1 overflow-hidden bg-white border border-[#E5E1D8] rounded-[8px] relative flex items-center justify-center p-2">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 order-2">
        <h3 className="text-[18px] font-semibold text-[#172033]">{vehicle.name}</h3>
        <p className="text-[13px] text-[#667085] mt-0.5">{vehicle.category}</p>

        {vehicle.owner?.shopName && (
          <span className="inline-block mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9A24D]">
            {vehicle.owner.shopName}
          </span>
        )}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium uppercase ${
              isAvailable ? "bg-[#E5F3ED] text-[#3E8B73]" : "bg-[#FBEAEA] text-[#C75C5C]"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
          <span className="text-[13px] text-[#667085]">
            {vehicle.quantityAvailable} available
          </span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[13px] text-[#667085]">
          <span>Free cancellation</span>
          <span className="text-[#E5E1D8]">·</span>
          <span>Helmet included</span>
        </div>

        {vehicle.location?.address && (
          <div className="flex items-start gap-1.5 mt-3 text-[13px] text-[#667085]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5 shrink-0">
              <path
                d="M6 0.75C3.79 0.75 2 2.54 2 4.75c0 3 4 6.5 4 6.5s4-3.5 4-6.5c0-2.21-1.79-4-4-4z"
                stroke="#C9A24D"
                strokeWidth="1"
              />
              <circle cx="6" cy="4.75" r="1.3" stroke="#C9A24D" strokeWidth="1" />
            </svg>
            <div>
              <p>{shortenAddress(vehicle.location.address)}</p>
              {distanceLabel && (
                <p className="text-[#C9A24D] font-medium mt-0.5">{distanceLabel}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-36 shrink-0 order-3 border-t md:border-t-0 md:border-l border-[#E5E1D8] pt-3 md:pt-0 md:pl-5 text-right">
        <p className="text-xl font-semibold text-[#172033] leading-tight">
          Rs. {vehicle.pricePerDay}
          <span className="text-[13px] font-normal text-[#667085]">/day</span>
        </p>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] bg-[#C9A24D] text-[#172033] text-[13px] font-semibold uppercase tracking-[0.04em] transition-colors group-hover:brightness-95">
          View
        </span>
      </div>
    </Link>
  );
};

export default VehicleCard;