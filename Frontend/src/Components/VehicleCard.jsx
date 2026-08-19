import React from "react";
import { Link } from "react-router-dom";

const shortenAddress = (address) => {
  if (!address) return "";
  return address.split(",")[0]?.trim();
};

const formatDistance = (meters) => {
  if (meters == null) return null;
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)} m away` : `${km.toFixed(1)} km away`;
};

/**
 * VehicleCard — audit-driven revision
 *
 * Changes vs. the previous version:
 * - Fixed 4:3 image container, consistent across cards regardless of
 *   source photo proportions (audit #4). White background + a light
 *   border, since the product photos aren't transparent PNGs — an
 *   ivory box created a visible seam around each image.
 * - Availability simplified to a status dot + label, with the count
 *   folded in as one secondary line instead of a badge + a second
 *   competing text block (audit #12).
 * - "Free cancellation · Helmet included" and location are visually
 *   de-duplicated: benefits stay as plain secondary text, location gets
 *   its own line with the pin icon so it doesn't blend into the
 *   benefits row (audit #13).
 * - Location is shortened to just the first address segment on the
 *   card; the full address still shows on the vehicle detail page
 *   (audit #14).
 * - CTA changed from "View" to "View Details" (audit #2).
 * - Card padding/line-heights tightened to reduce overall card height
 *   (audit #3).
 */
const VehicleCard = ({ vehicle }) => {
  const distanceLabel = formatDistance(vehicle.distanceMeters);
  const isAvailable = (vehicle.quantityAvailable ?? 0) > 0;
  const isLowStock = isAvailable && vehicle.quantityAvailable <= 2;

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="group flex flex-col sm:flex-row items-stretch gap-4 bg-white border border-[#E5E1D8] rounded-[8px] p-4 shadow-[0_2px_8px_rgba(23,32,51,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(23,32,51,0.08)] hover:border-[#C9A24D]/50"
    >
      {/* Image — fixed 4:3 ratio, white background with a light border so it
          reads cleanly even when source photos aren't transparent PNGs */}
      <div className="w-full sm:w-[170px] shrink-0">
        <div className="w-full aspect-[4/3] bg-white border border-[#E5E1D8] rounded-[8px] overflow-hidden flex items-center justify-center p-3">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[18px] font-semibold text-[#172033] leading-tight truncate">
              {vehicle.name}
            </h3>
            <p className="text-[13px] text-[#667085] mt-0.5">{vehicle.category}</p>
          </div>

          {vehicle.owner?.shopName && (
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-[#C9A24D] whitespace-nowrap">
              {vehicle.owner.shopName}
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isAvailable ? "bg-[#3E8B73]" : "bg-[#C75C5C]"
            }`}
          />
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
              isAvailable ? "text-[#3E8B73]" : "text-[#C75C5C]"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
          {isAvailable && (
            <span className="text-[12px] text-[#667085]">
              · {isLowStock ? `only ${vehicle.quantityAvailable} left` : `${vehicle.quantityAvailable} available`}
            </span>
          )}
        </div>

        {/* Benefits */}
        <p className="text-[13px] text-[#667085] mt-1.5">
          Free cancellation · Helmet included
        </p>

        {/* Location */}
        {vehicle.location?.address && (
          <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-[#344054]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
              <path
                d="M6 0.75C3.79 0.75 2 2.54 2 4.75c0 3 4 6.5 4 6.5s4-3.5 4-6.5c0-2.21-1.79-4-4-4z"
                stroke="#C9A24D"
                strokeWidth="1"
              />
              <circle cx="6" cy="4.75" r="1.3" stroke="#C9A24D" strokeWidth="1" />
            </svg>
            <span className="truncate">{shortenAddress(vehicle.location.address)}</span>
            {distanceLabel && (
              <span className="text-[#C9A24D] font-medium whitespace-nowrap">
                · {distanceLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:w-32 shrink-0 border-t sm:border-t-0 sm:border-l border-[#E5E1D8] pt-3 sm:pt-0 sm:pl-4 text-right">
        <p className="text-[22px] font-bold text-[#172033] leading-tight">
          Rs. {vehicle.pricePerDay}
          <span className="text-[13px] font-normal text-[#667085]"> /day</span>
        </p>
        <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] bg-[#C9A24D] text-[#172033] text-[13px] font-semibold whitespace-nowrap transition-colors group-hover:brightness-95">
          View Details
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#172033" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default VehicleCard;