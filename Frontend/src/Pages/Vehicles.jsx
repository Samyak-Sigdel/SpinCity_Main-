import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VehicleCard from "../Components/VehicleCard";
import LocationPickerModal from "../Components/LocationPickerModal";
import { VEHICLE_CATEGORIES } from "../Context/CustomerContext";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "distance", label: "Nearest First" },
];

const Vehicles = () => {
  const backendUrl = import.meta.env.VITE_BACKENDURL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const activeAddress = searchParams.get("address") || "";
  const activeLat = searchParams.get("lat");
  const activeLng = searchParams.get("lng");

  // Sidebar filter state
  const [sortBy, setSortBy] = useState("popular");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedVendors, setSelectedVendors] = useState([]); // empty = all
  const [selectedTypes, setSelectedTypes] = useState([]); // empty = all

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.get("search")) params.search = searchParams.get("search");
      if (activeLat && activeLng) {
        params.lat = activeLat;
        params.lng = activeLng;
      }

      const { data } = await axios.get(backendUrl + "/api/user/products", { params });
      if (data.success) {
        setVehicles(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = Object.fromEntries(searchParams);
    if (searchTerm) params.search = searchTerm;
    else delete params.search;
    setSearchParams(params);
  };

  const handleLocationConfirm = (place) => {
    const params = Object.fromEntries(searchParams);
    params.lat = place.lat;
    params.lng = place.lon;
    params.address = place.address;
    setSearchParams(params);
  };

  const clearLocation = () => {
    const params = Object.fromEntries(searchParams);
    delete params.lat;
    delete params.lng;
    delete params.address;
    setSearchParams(params);
  };

  // Vendors present in the current result set, for the sidebar checkbox list
  const availableVendors = useMemo(() => {
    const names = new Set();
    vehicles.forEach((v) => v.owner?.shopName && names.add(v.owner.shopName));
    return Array.from(names);
  }, [vehicles]);

  const toggleVendor = (name) => {
    setSelectedVendors((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const priceBounds = useMemo(() => {
    if (vehicles.length === 0) return { min: 0, max: 0 };
    const prices = vehicles.map((v) => v.pricePerDay);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [vehicles]);

  const displayedVehicles = useMemo(() => {
    let result = [...vehicles];

    if (selectedTypes.length > 0) {
      result = result.filter((v) => selectedTypes.includes(v.category));
    }
    if (selectedVendors.length > 0) {
      result = result.filter((v) => selectedVendors.includes(v.owner?.shopName));
    }
    if (priceMin !== "") {
      result = result.filter((v) => v.pricePerDay >= Number(priceMin));
    }
    if (priceMax !== "") {
      result = result.filter((v) => v.pricePerDay <= Number(priceMax));
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === "distance") {
      result.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
    }
    // "popular" = keep backend's default order

    return result;
  }, [vehicles, selectedTypes, selectedVendors, priceMin, priceMax, sortBy]);

  return (
    <div className="bg-[#0B0D0F] min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-px bg-[#D6B36A]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D6B36A]">
            Spin City
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#F5F3EE] mb-2">
          All Vehicles
        </h1>
        {activeAddress && (
          <p className="text-sm text-[#858B91] mb-6">
            Showing vehicles near{" "}
            <span className="text-[#F5F3EE] font-medium">{activeAddress}</span>{" "}
            <button onClick={clearLocation} className="text-[#D6B36A] underline text-xs ml-1">
              clear
            </button>
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 mt-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-2 border border-white/10 bg-[#181D21] px-4 py-3 w-full text-left hover:border-[#D6B36A]/60 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="7" cy="7" r="5" stroke="#858B91" strokeWidth="1.5" />
                <path d="M11 11l4 4" stroke="#858B91" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-sm text-[#858B91] truncate">
                {activeAddress ? "Change location" : "Search near a location"}
              </span>
            </button>

            <LocationPickerModal
              isOpen={locationModalOpen}
              onClose={() => setLocationModalOpen(false)}
              onConfirm={handleLocationConfirm}
              initialAddress={activeAddress}
            />

            <form onSubmit={handleSearchSubmit}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicles..."
                className="w-full bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-4 py-2.5 text-sm focus:outline-none focus:border-[#D6B36A]"
              />
            </form>

            {/* Sort by */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#858B91] mb-2">
                Sort by
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#181D21] border border-white/10 text-[#F5F3EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#D6B36A] [color-scheme:dark]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#858B91] mb-3">
                Price per day
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder={priceBounds.min ? String(priceBounds.min) : "Min"}
                  className="w-1/2 bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-2 py-2 text-xs focus:outline-none focus:border-[#D6B36A]"
                />
                <span className="text-[#858B91] text-xs">–</span>
                <input
                  type="number"
                  min="0"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder={priceBounds.max ? String(priceBounds.max) : "Max"}
                  className="w-1/2 bg-[#181D21] border border-white/10 text-[#F5F3EE] placeholder:text-[#70767C] px-2 py-2 text-xs focus:outline-none focus:border-[#D6B36A]"
                />
              </div>
              {(priceMin !== "" || priceMax !== "") && (
                <button
                  onClick={() => {
                    setPriceMin("");
                    setPriceMax("");
                  }}
                  className="text-[11px] text-[#D6B36A] underline mt-2"
                >
                  Clear price filter
                </button>
              )}
            </div>

            {/* Vendor */}
            {availableVendors.length > 0 && (
              <div className="border-t border-white/10 pt-5">
                <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#858B91] mb-3">
                  Vendor
                </p>
                <label className="flex items-center gap-2 text-sm text-[#F5F3EE] mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedVendors.length === 0}
                    onChange={() => setSelectedVendors([])}
                    className="accent-[#D6B36A]"
                  />
                  All Vendors
                </label>
                {availableVendors.map((name) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 text-sm text-[#B5B8BB] mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(name)}
                      onChange={() => toggleVendor(name)}
                      className="accent-[#D6B36A]"
                    />
                    {name}
                  </label>
                ))}
              </div>
            )}

            {/* Vehicle type */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#858B91] mb-3">
                Vehicle Type
              </p>
              <label className="flex items-center gap-2 text-sm text-[#F5F3EE] mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.length === 0}
                  onChange={() => setSelectedTypes([])}
                  className="accent-[#D6B36A]"
                />
                All Types
              </label>
              {VEHICLE_CATEGORIES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm text-[#B5B8BB] mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="accent-[#D6B36A]"
                  />
                  {type}
                </label>
              ))}
            </div>
          </aside>

          {/* Results */}
          <div>
            {loading ? (
              <p className="text-sm text-[#858B91]">Loading vehicles...</p>
            ) : displayedVehicles.length === 0 ? (
              <div className="border border-dashed border-white/10 py-16 text-center">
                <p className="text-[#858B91] text-sm">
                  {activeAddress
                    ? "No vehicles available near this location."
                    : "No vehicles match your filters."}
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#858B91] mb-4">
                  {displayedVehicles.length} vehicle{displayedVehicles.length !== 1 ? "s" : ""} found
                </p>
                <div className="flex flex-col gap-4">
                  {displayedVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;