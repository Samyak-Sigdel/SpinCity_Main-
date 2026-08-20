import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VehicleCard from "../Components/VehicleCard";
import LocationPickerModal from "../Components/LocationPickerModal";
import { VEHICLE_CATEGORIES } from "../Context/CustomerContext";

const SORT_OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "distance", label: "Nearest first" },
];

const Vehicles = () => {
  const backendUrl = import.meta.env.VITE_BACKENDURL;

  const [searchParams, setSearchParams] = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const [sortBy, setSortBy] = useState("popular");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  /* =========================================================
     ACTIVE SEARCH PARAMS
  ========================================================= */

  const activeAddress = searchParams.get("address") || "";
  const activeLat = searchParams.get("lat");
  const activeLng = searchParams.get("lng");

  /* =========================================================
     FETCH VEHICLES
  ========================================================= */

  const fetchVehicles = async () => {
    setLoading(true);

    try {
      const params = {};

      const search = searchParams.get("search");

      if (search) {
        params.search = search;
      }

      if (activeLat && activeLng) {
        params.lat = activeLat;
        params.lng = activeLng;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/user/products`,
        { params }
      );

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

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = Object.fromEntries(searchParams);

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    } else {
      delete params.search;
    }

    setSearchParams(params);
  };

  /* =========================================================
     LOCATION
  ========================================================= */

  const handleLocationConfirm = (place) => {
    const params = Object.fromEntries(searchParams);

    params.lat = place.lat;
    params.lng = place.lon;
    params.address = place.address;

    setSearchParams(params);
    setLocationModalOpen(false);
  };

  const clearLocation = () => {
    const params = Object.fromEntries(searchParams);

    delete params.lat;
    delete params.lng;
    delete params.address;

    setSearchParams(params);
  };

  /* =========================================================
     FILTERS
  ========================================================= */

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const priceBounds = useMemo(() => {
    if (!vehicles.length) {
      return {
        min: 0,
        max: 0,
      };
    }

    const prices = vehicles.map(
      (vehicle) => vehicle.pricePerDay
    );

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [vehicles]);

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    priceMin !== "" ||
    priceMax !== "" ||
    !!searchTerm ||
    !!activeAddress;

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setPriceMin("");
    setPriceMax("");
    setSearchTerm("");

    const params = Object.fromEntries(searchParams);

    delete params.search;
    delete params.lat;
    delete params.lng;
    delete params.address;

    setSearchParams(params);
  };

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const displayedVehicles = useMemo(() => {
    let result = [...vehicles];

    // Vehicle type
    if (selectedTypes.length > 0) {
      result = result.filter((vehicle) =>
        selectedTypes.includes(vehicle.category)
      );
    }

    // Minimum price
    if (priceMin !== "") {
      result = result.filter(
        (vehicle) =>
          vehicle.pricePerDay >= Number(priceMin)
      );
    }

    // Maximum price
    if (priceMax !== "") {
      result = result.filter(
        (vehicle) =>
          vehicle.pricePerDay <= Number(priceMax)
      );
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort(
        (a, b) => a.pricePerDay - b.pricePerDay
      );
    }

    if (sortBy === "price_desc") {
      result.sort(
        (a, b) => b.pricePerDay - a.pricePerDay
      );
    }

    if (sortBy === "distance") {
      result.sort(
        (a, b) =>
          (a.distanceMeters ?? Infinity) -
          (b.distanceMeters ?? Infinity)
      );
    }

    return result;
  }, [
    vehicles,
    selectedTypes,
    priceMin,
    priceMax,
    sortBy,
  ]);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F6F7F5]">

      <div
        className="
          mx-auto
          max-w-[1320px]
          px-4
          sm:px-6
          lg:px-8
          pt-5
          pb-8
        "
      >

        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[320px_minmax(0,1fr)]
            gap-8
            items-start
          "
        >

          {/* ===================================================
              FILTER SIDEBAR
          =================================================== */}

          <aside
            className="
              bg-white
              border
              border-[#E5E5DE]
              rounded-xl
              p-6
              h-fit
              shadow-[0_1px_3px_rgba(16,24,40,0.04)]
            "
          >

            {/* =================================================
                FILTER HEADER
            ================================================= */}

            <div className="flex items-center justify-between mb-6">

              <div>
                <p
                  className="
                    text-base
                    font-semibold
                    text-[#172033]
                  "
                >
                  Filters
                </p>

                <p
                  className="
                    text-sm
                    text-[#98A2B3]
                    mt-1
                  "
                >
                  Refine your search
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="
                    text-sm
                    font-medium
                    text-[#08785F]
                    hover:underline
                  "
                >
                  Clear all
                </button>
              )}

            </div>

            {/* =================================================
                PICKUP LOCATION
            ================================================= */}

            <div className="mb-6">

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#344054]
                  mb-2.5
                "
              >
                Pickup location
              </p>

              <button
                onClick={() =>
                  setLocationModalOpen(true)
                }
                className="
                  w-full
                  min-h-11
                  flex
                  items-center
                  gap-2.5
                  px-3.5
                  py-2.5
                  bg-[#FAFAF7]
                  border
                  border-[#E5E5DE]
                  rounded-md
                  text-left
                  hover:border-[#08785F]
                  transition-colors
                "
              >

                {/* Location Icon */}

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0"
                >
                  <path
                    d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                    stroke="#08785F"
                    strokeWidth="2"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                    stroke="#08785F"
                    strokeWidth="2"
                  />
                </svg>

                <span
                  className="
                    text-base
                    leading-5
                    truncate
                    text-[#344054]
                  "
                >
                  {activeAddress ||
                    "Select pickup location"}
                </span>

              </button>

              {activeAddress && (
                <button
                  onClick={clearLocation}
                  className="
                    mt-2
                    text-sm
                    text-[#667085]
                    hover:text-[#08785F]
                  "
                >
                  Remove location
                </button>
              )}

            </div>

            {/* =================================================
                LOCATION MODAL
            ================================================= */}

            <LocationPickerModal
              isOpen={locationModalOpen}
              onClose={() =>
                setLocationModalOpen(false)
              }
              onConfirm={handleLocationConfirm}
              initialAddress={activeAddress}
            />

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="mb-6">

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#344054]
                  mb-2.5
                "
              >
                Search vehicles
              </p>

              <form onSubmit={handleSearchSubmit}>

                <input
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search by name or model"
                  className="
                    w-full
                    h-11
                    px-3.5
                    bg-[#FAFAF7]
                    border
                    border-[#E5E5DE]
                    rounded-md
                    text-base
                    text-[#172033]
                    placeholder:text-[#98A2B3]
                    outline-none
                    focus:border-[#08785F]
                    transition-colors
                  "
                />

              </form>

            </div>

            {/* =================================================
                DAILY PRICE
            ================================================= */}

            <div className="mb-6">

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#344054]
                  mb-2.5
                "
              >
                Daily price
              </p>

              <div className="flex items-center gap-2.5">

                {/* MIN PRICE */}

                <div className="relative flex-1">

                  <span
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      text-[#98A2B3]
                    "
                  >
                    Rs.
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={priceMin}
                    onChange={(e) =>
                      setPriceMin(e.target.value)
                    }
                    placeholder={
                      priceBounds.min
                        ? String(priceBounds.min)
                        : "Min"
                    }
                    className="
                      w-full
                      h-11
                      pl-9
                      pr-2
                      bg-[#FAFAF7]
                      border
                      border-[#E5E5DE]
                      rounded-md
                      text-base
                      text-[#172033]
                      outline-none
                      focus:border-[#08785F]
                    "
                  />

                </div>

                <span
                  className="
                    text-sm
                    text-[#98A2B3]
                    shrink-0
                  "
                >
                  –
                </span>

                {/* MAX PRICE */}

                <div className="relative flex-1">

                  <span
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      text-[#98A2B3]
                    "
                  >
                    Rs.
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={priceMax}
                    onChange={(e) =>
                      setPriceMax(e.target.value)
                    }
                    placeholder={
                      priceBounds.max
                        ? String(priceBounds.max)
                        : "Max"
                    }
                    className="
                      w-full
                      h-11
                      pl-9
                      pr-2
                      bg-[#FAFAF7]
                      border
                      border-[#E5E5DE]
                      rounded-md
                      text-base
                      text-[#172033]
                      outline-none
                      focus:border-[#08785F]
                    "
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                VEHICLE TYPE
            ================================================= */}

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#344054]
                  mb-3.5
                "
              >
                Vehicle type
              </p>

              {/* ALL VEHICLES */}

              <label
                className="
                  flex
                  items-center
                  gap-3
                  text-base
                  text-[#344054]
                  mb-3
                  cursor-pointer
                "
              >

                <input
                  type="checkbox"
                  checked={selectedTypes.length === 0}
                  onChange={() =>
                    setSelectedTypes([])
                  }
                  className="
                    accent-[#08785F]
                    h-5
                    w-5
                    shrink-0
                  "
                />

                <span>All vehicles</span>

              </label>

              {/* VEHICLE CATEGORIES */}

              {VEHICLE_CATEGORIES.map((type) => (

                <label
                  key={type}
                  className="
                    flex
                    items-center
                    gap-3
                    text-base
                    text-[#344054]
                    mb-3
                    cursor-pointer
                  "
                >

                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() =>
                      toggleType(type)
                    }
                    className="
                      accent-[#08785F]
                      h-5
                      w-5
                      shrink-0
                    "
                  />

                  <span>{type}</span>

                </label>

              ))}

            </div>

          </aside>

          {/* ===================================================
              RESULTS SECTION
          =================================================== */}

          <section className="min-w-0">

            {/* =================================================
                RESULTS HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                mb-5
                pb-4
                border-b
                border-[#E8E8E1]
                gap-4
              "
            >

              {/* TITLE */}

              <div className="min-w-0">

                <h1
                  className="
                    font-['Oswald']
                    font-semibold
                    text-2xl
                    sm:text-3xl
                    leading-[1.05]
                    tracking-[-0.02em]
                    text-[#172033]
                  "
                >
                  All Vehicles
                </h1>

                <p
                  className="
                    mt-1.5
                    text-base
                    text-[#667085]
                  "
                >
                  {loading
                    ? "Finding available vehicles..."
                    : `${displayedVehicles.length} ${
                        displayedVehicles.length === 1
                          ? "vehicle"
                          : "vehicles"
                      } available`}
                </p>

              </div>

              {/* SORT */}

              <div className="flex items-center shrink-0">

                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="
                    h-11
                    min-w-[180px]
                    bg-white
                    border
                    border-[#E5E5DE]
                    rounded-md
                    px-3.5
                    text-base
                    text-[#172033]
                    outline-none
                    focus:border-[#08785F]
                    cursor-pointer
                  "
                >

                  {SORT_OPTIONS.map((option) => (

                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {/* =================================================
                LOADING STATE
            ================================================= */}

            {loading ? (

              <div
                className="
                  bg-white
                  border
                  border-[#E5E5DE]
                  rounded-xl
                  py-14
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    mb-3
                    h-7
                    w-7
                    rounded-full
                    border-2
                    border-[#D6E5E0]
                    border-t-[#08785F]
                    animate-spin
                  "
                />

                <p
                  className="
                    text-base
                    text-[#667085]
                  "
                >
                  Finding vehicles...
                </p>

              </div>

            ) : displayedVehicles.length === 0 ? (

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div
                className="
                  bg-white
                  border
                  border-dashed
                  border-[#E5E5DE]
                  rounded-xl
                  py-16
                  px-6
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    mb-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F0F7F4]
                  "
                >

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 13h18M5 13l1.5-6h11L19 13M6 13v5m12-5v5M8 18h8"
                      stroke="#08785F"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </div>

                <h3
                  className="
                    text-base
                    font-semibold
                    text-[#172033]
                  "
                >
                  No vehicles found
                </h3>

                <p
                  className="
                    mt-1.5
                    text-base
                    text-[#667085]
                  "
                >
                  {activeAddress
                    ? "No vehicles are available at this location."
                    : "Try adjusting your search or filters."}
                </p>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="
                      mt-4
                      text-base
                      font-medium
                      text-[#08785F]
                      hover:underline
                    "
                  >
                    Clear filters
                  </button>
                )}

              </div>

            ) : (

              /* =================================================
                 VEHICLE LIST
              ================================================= */

              <div className="flex flex-col gap-4">

                {displayedVehicles.map((vehicle) => (

                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                  />

                ))}

              </div>

            )}

          </section>

        </div>

      </div>

    </div>
  );
};

export default Vehicles;